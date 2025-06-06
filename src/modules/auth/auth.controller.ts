import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Request } from 'express';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { SkipJwtAuth } from 'src/annotations/skipAuth.annotation';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

import { CreateUserDto, createUserSchema } from '../users/dto';
import { loginSchema, TokensDto } from './dto';
import { ICreateUser, IReturnUser } from '../users/interfaces';
import { ILogin } from './interfaces';

import { collectionKey, responseMessage, summaries } from 'src/common/text';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('register')
  @SkipJwtAuth()
  @ApiOperation({ summary: summaries.create(collectionKey.user) })
  @ApiOkResponse({ description: responseMessage.success, type: Boolean })
  @ApiBadRequestResponse({ description: responseMessage.badRequest })
  @ApiBody({ type: ICreateUser })
  async register(
    @Body(new ZodValidationPipe(createUserSchema)) body: CreateUserDto,
  ): Promise<boolean> {
    return this.authService.register(body);
  }

  @Post('login')
  @SkipJwtAuth()
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: summaries.login() })
  @ApiOkResponse({ description: responseMessage.success, type: TokensDto })
  @ApiBadRequestResponse({ description: responseMessage.badRequest })
  @ApiBody({ type: ILogin })
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Req() req: Request): Promise<TokensDto> {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.refresh() })
  @ApiOkResponse({ description: responseMessage.success, type: TokensDto })
  @ApiBadRequestResponse({ description: responseMessage.badRequest })
  async refresh(@Req() req: Request): Promise<TokensDto> {
    return this.authService.refreshToken(req.user);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.profile() })
  @ApiOkResponse({ description: responseMessage.success, type: IReturnUser })
  @ApiBadRequestResponse({ description: responseMessage.badRequest })
  async profile(@Req() req: Request): Promise<IReturnUser> {
    const user = await this.userService.findOneById(req.user['id']);
    if (!user) throw new BadRequestException('User not found');
    return this.userService.getBasicUserInfo(user);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.logout() })
  @ApiOkResponse({ description: responseMessage.success, type: Boolean })
  @ApiBadRequestResponse({ description: responseMessage.badRequest })
  async logout(@Req() req: Request): Promise<boolean> {
    await this.authService.logout(req.user);
    return true;
  }
}
