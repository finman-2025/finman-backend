import * as argon2 from 'argon2';
import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { RegisterDto, TokensDto } from './dto';
import { PrismaService } from 'src/config/db.config';
import { UsersService } from '../users/users.service';

import { responseMessage } from 'src/common/text';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  async verifyPassword(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOneByUsername(username);
    if (!user)
      throw new BadRequestException(responseMessage.wrongUsernameOrPassword);

    const valid = await this.verifyPassword(user.password, password);
    if (!valid)
      throw new BadRequestException(responseMessage.wrongUsernameOrPassword);

    return user;
  }

  async validateAccessTokenPayload(payload: any) {
    const user = await this.usersService.findOneById(payload.sub);
    return {
      id: user.id,
      username: user.username,
      refreshToken: user.refreshToken,
    };
  }

  async getTokens(id: number, username: string) {
    const payload = { sub: id, username };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES'),
      }),
    ]);

    return new TokensDto(accessToken, refreshToken);
  }

  async register(dto: RegisterDto) {
    const userExists = await this.usersService.findOneByUsername(dto.username);
    if (userExists) throw new BadRequestException('User already exists');

    const hash = await this.hashPassword(dto.password);
    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        password: hash,
        email: dto.email,
        name: dto.name,
      },
    });

    if (!user) throw new ServiceUnavailableException('Can not create new user');

    return true;
  }

  async login(user: any) {
    const tokens = await this.getTokens(user.id, user.username);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return tokens;
  }

  async refreshToken(user: any) {
    const tokens = await this.getTokens(user.id, user.username);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return tokens;
  }

  async logout(user: any) {
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: null },
    });

    return true;
  }
}
