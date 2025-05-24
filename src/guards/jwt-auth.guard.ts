import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { SKIP_JWT_AUTH_KEY } from 'src/annotations/skipAuth.annotation';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      SKIP_JWT_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );
    // Store isPublic in the request for use in handleRequest
    const request = context.switchToHttp().getRequest();
    request.isPublic = isPublic;
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    // Allow public endpoints to pass through without authentication
    const req = context.switchToHttp().getRequest();
    if (req.isPublic) {
      return user;
    }
    return super.handleRequest(err, user, info, context);
  }
}
