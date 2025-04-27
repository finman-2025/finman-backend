import { Body, Controller, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { collectionKey, responseMessage, summaries } from 'src/common/text';
import { ICreateUser, IReturnUser } from '../users/interfaces';
import { CreateUserDto, createUserSchema } from '../users/dto';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { ILogin } from './interfaces';
import { loginSchema } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: summaries.create(collectionKey.user) })
    @ApiOkResponse({ description: responseMessage.success, type: Boolean })
    @ApiBadRequestResponse({ description: responseMessage.badRequest })
    @ApiBody({ type: ICreateUser})
    async register(
        @Body(new ZodValidationPipe(createUserSchema)) body: CreateUserDto
    ): Promise<Boolean> {
        return this.authService.register(body);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiOkResponse({ description: responseMessage.success, type: IReturnUser })
    @ApiBadRequestResponse({ description: responseMessage.badRequest })
    @ApiBody({ type: ILogin })
    @UsePipes(new ZodValidationPipe(loginSchema))
    async login(@Req() req: Request) {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('profile')
    @ApiOkResponse({ description: responseMessage.success, type: IReturnUser })
    @ApiBadRequestResponse({ description: responseMessage.badRequest })
    async profile(@Req() req: Request) {
        return req.user;
    }
}