import * as argon2 from 'argon2';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/config/db.config';
import { UsersService } from '../users/users.service';
import { RegisterDto, TokensDto } from './dto';
import { responseMessage } from 'src/common/text';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
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
    return { id: user.id, username: user.username };
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
    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return new TokensDto(accessToken, refreshToken);
  }

  async refreshToken(username: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    try {
      const payload = this.jwtService.verify(refreshToken);

      const newAccessToken = this.jwtService.sign(
        { username: user.username, sub: user.id },
        { expiresIn: '15m' },
      );

      return new TokensDto(newAccessToken, refreshToken);
    } catch (e) {
      throw new ServiceUnavailableException('Can not refresh token');
    }
  }

  async logout(user: any) {
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: null },
    });
    
    return true;
  }
}
