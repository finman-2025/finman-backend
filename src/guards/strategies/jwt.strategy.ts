import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { AuthService } from '../../modules/auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    let user = await this.authService.validateAccessTokenPayload(payload);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (req.url === '/auth/refresh') {
      const refreshToken = req
        .get('Authorization')
        .replace('Bearer', '')
        .trim();
      if (refreshToken !== user.refreshToken) {
        throw new UnauthorizedException('Invalid credentials');
      }
    }
    return { id: user.id, username: user.username };
  }
}
