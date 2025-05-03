import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

import { SkipJwtAuth } from './annotations/skipAuth.annotation';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @SkipJwtAuth()
  @ApiResponse({ type: String })
  getHello(): string {
    return this.appService.getHello();
  }
}
