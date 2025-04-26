import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokensService } from 'src/modules/tokens/tokens.service';
import { Reflector } from '@nestjs/core';
import { SKIP_ACCESS_AUTH_KEY } from '../customAnnotation/skipAuth.annotation';

@Injectable()
export class RefreshTokenAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private tokensService: TokensService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const isPublic = this.reflector.getAllAndOverride<boolean>(
    //   SKIP_ACCESS_AUTH_KEY,
    //   [context.getHandler(), context.getClass()],
    // );
    // if (isPublic) {
    //   // 💡 See this condition
    //   return true;
    // }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const dbToken = await this.tokensService.findRefreshTokenbyUserIdAndToken(
        payload.sub,
        token,
      );
      // console.log('[accessTokenGuard]check dbtToken: ', dbToken);
      //   console.log('payload: ', payload);

      if (!dbToken) {
        console.log('ko co token trong db');
        throw new UnauthorizedException();
      }

      // // THỪA, vì ở trên đã query tìm (userId, token) rồi
      //   if (dbToken.token !== token) {
      //     console.log('so sanh token fail mac du CO token trong db');
      //     throw new UnauthorizedException();
      //   }

      // chưa có refreshToken, tự add vào
      payload['refreshToken'] = token;
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
      //   console.log('success 1');
    } catch {
      throw new UnauthorizedException();
    }
    // console.log('success 2');

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
