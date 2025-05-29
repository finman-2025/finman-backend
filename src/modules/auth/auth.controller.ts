import {
  Body,
  Controller,
  Get,
  NotFoundException,
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

import {
  collectionKey,
  fieldKey,
  responseMessage,
  summaries,
} from 'src/common/text';
import { ExceptionDto, IResponseMessage } from 'src/common/dto';

import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { SkipJwtAuth } from 'src/annotations/skipAuth.annotation';

import { CreateUserDto, createUserSchema } from 'src/modules/users/dto';
import {
  LoginDto,
  loginSchema,
  TokensDto,
  RefreshDto,
  refreshSchema,
  ChangePasswordDto,
  changePasswordSchema,
} from './dto';
import { ICreateUser, IReturnUser } from 'src/modules/users/interfaces';
import { IChangePassword, ILogin, IRefresh } from './interfaces';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @SkipJwtAuth()
  @ApiOperation({ summary: summaries.create(collectionKey.user) })
  @ApiOkResponse({
    description: responseMessage.success,
    type: IResponseMessage,
  })
  @ApiBadRequestResponse({
    description: responseMessage.badRequest(),
    type: ExceptionDto,
  })
  @ApiBody({ type: ICreateUser })
  async register(
    @Body(new ZodValidationPipe(createUserSchema)) body: CreateUserDto,
  ): Promise<IResponseMessage> {
    await this.authService.register(body);
    return { message: responseMessage.success };
  }

  @Post('login')
  @SkipJwtAuth()
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: summaries.login() })
  @ApiOkResponse({
    description: responseMessage.success,
    type: TokensDto,
  })
  @ApiBadRequestResponse({
    description: responseMessage.badRequest(),
    type: ExceptionDto,
  })
  @ApiBody({ type: ILogin })
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Req() req: Request, @Body() body: LoginDto): Promise<TokensDto> {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @SkipJwtAuth()
  @ApiOperation({ summary: summaries.refresh() })
  @ApiOkResponse({
    description: responseMessage.success,
    type: TokensDto,
  })
  @ApiBadRequestResponse({
    description: responseMessage.badRequest(),
    type: ExceptionDto,
  })
  @ApiBody({ type: IRefresh })
  @UsePipes(new ZodValidationPipe(refreshSchema))
  async refresh(@Body() body: RefreshDto): Promise<TokensDto> {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.profile() })
  @ApiOkResponse({
    description: responseMessage.success,
    type: IReturnUser,
  })
  @ApiBadRequestResponse({
    description: responseMessage.badRequest(),
    type: ExceptionDto,
  })
  async profile(@Req() req: Request): Promise<IReturnUser> {
    const user = await this.usersService.findOneById(req.user['id']);
    if (!user)
      throw new NotFoundException(responseMessage.notFound(collectionKey.user));

    return this.usersService.extractProfileData(user);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.logout() })
  @ApiOkResponse({
    description: responseMessage.success,
    type: IResponseMessage,
  })
  @ApiBadRequestResponse({
    description: responseMessage.badRequest(),
    type: ExceptionDto,
  })
  async logout(@Req() req: Request): Promise<IResponseMessage> {
    await this.authService.logout(req.user['id']);
    return { message: responseMessage.success };
  }

  @Post('change-password')
  @ApiBearerAuth()
  @ApiOperation({
    summary: summaries.update(collectionKey.user, fieldKey.password),
  })
  @ApiOkResponse({
    description: responseMessage.success,
    type: IResponseMessage,
  })
  @ApiBadRequestResponse({
    description: responseMessage.badRequest(),
    type: ExceptionDto,
  })
  @ApiBody({ type: IChangePassword })
  @UsePipes(new ZodValidationPipe(changePasswordSchema))
  async changePassword(
    @Req() req: Request,
    @Body() body: ChangePasswordDto,
  ): Promise<IResponseMessage> {
    await this.authService.changePassword(
      req.user['id'],
      body.oldPassword,
      body.newPassword,
    );
    return { message: responseMessage.success };
  }
}
