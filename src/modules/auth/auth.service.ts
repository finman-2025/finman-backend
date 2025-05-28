import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';

import { PrismaService } from 'src/config/db.config';

import {
  collectionKey,
  fieldKey,
  messages,
  responseMessage,
} from 'src/common/text';

import { RegisterDto, TokensDto } from './dto';

import { UsersService } from 'src/modules/users/users.service';

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
      throw new NotFoundException(responseMessage.notFound(fieldKey.username));

    const valid = await this.verifyPassword(user.password, password);
    if (!valid)
      throw new BadRequestException(responseMessage.wrongUsernameOrPassword);

    return user;
  }

  async validateAccessTokenPayload(payload: any) {
    const user = await this.usersService.findOneById(payload.sub);
    if (!user)
      throw new UnauthorizedException(
        responseMessage.notFound(collectionKey.user),
      );
    return {
      id: user.id,
      username: user.username,
    };
  }

  async getTokens(id: number) {
    const payload = { sub: id };

    // const [accessToken, refreshToken] = await Promise.all([
    //   this.jwtService.signAsync(payload, {
    //     expiresIn: this.configService.get<number>('ACCESS_TOKEN_EXPIRES'),
    //   }),
    //   this.jwtService.signAsync(payload, {
    //     expiresIn: this.configService.get<number>('REFRESH_TOKEN_EXPIRES'),
    //   }),
    // ]);

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<number>('ACCESS_TOKEN_EXPIRES') * 1000,
    });

    let refreshTokenLength: number =
      this.configService.get<number>('REFRESH_TOKEN_LENGTH') || 6;
    refreshTokenLength = Number(refreshTokenLength);
    const refreshToken = randomBytes(refreshTokenLength).toString('hex');

    if (!accessToken || !refreshToken)
      throw new ServiceUnavailableException(
        responseMessage.internalServerError,
      );

    return new TokensDto(accessToken, refreshToken);
  }

  async register(data: RegisterDto) {
    const userExists = await this.usersService.findOneByUsername(data.username);
    if (userExists)
      throw new ConflictException(
        responseMessage.alreadyExists(fieldKey.username),
      );

    const hash = await this.hashPassword(data.password);
    const user = await this.prisma.user.create({
      data: {
        username: data.username,
        password: hash,
        email: data.email,
        name: data.name,
      },
    });

    if (!user)
      throw new ServiceUnavailableException(
        responseMessage.internalServerError,
      );
  }

  async login(user: any) {
    const tokens = await this.getTokens(user['id']);

    await this.prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user['id'] as number,
        expiresAt: new Date(
          Date.now() +
            this.configService.get<number>('REFRESH_TOKEN_EXPIRES') * 1000,
        ),
      },
    });

    return tokens;
  }

  async refreshToken(refreshToken: string) {
    const tokenData = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });
    if (!tokenData)
      throw new BadRequestException(messages.missing(fieldKey.refreshToken));

    try {
      const newAccessToken = await this.jwtService.signAsync(
        { sub: tokenData.userId },
        {
          expiresIn:
            this.configService.get<number>('ACCESS_TOKEN_EXPIRES') * 1000,
        },
      );

      return new TokensDto(newAccessToken, refreshToken);
    } catch {
      throw new UnauthorizedException(responseMessage.sectionExpired);
    }
  }

  async logout(userId: number) {
    await this.prisma.refreshToken.deleteMany({
      where: { userId: userId },
    });
  }
}
