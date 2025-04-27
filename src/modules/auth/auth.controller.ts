import { BadRequestException, Body, Controller, Get, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { collectionKey, responseMessage, summaries } from 'src/common/text';
import { ICreateUser, IReturnUser } from '../users/interfaces';
import { CreateUserDto, createUserSchema } from '../users/dto';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { ILogin, IRefresh } from './interfaces';
import { loginSchema, TokensDto } from './dto';
import { UsersService } from '../users/users.service';
import { RefreshDto, refreshSchema } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService
    ) {}

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
    @ApiOkResponse({ description: responseMessage.success, type: TokensDto })
    @ApiBadRequestResponse({ description: responseMessage.badRequest })
    @ApiBody({ type: ILogin })
    @UsePipes(new ZodValidationPipe(loginSchema))
    async login(@Req() req: Request): Promise<TokensDto> {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('refresh')
    @ApiOkResponse({ description: responseMessage.success, type: TokensDto })
    @ApiBadRequestResponse({ description: responseMessage.badRequest })
    @ApiBearerAuth()
    @ApiBody({ type: IRefresh })
    @UsePipes(new ZodValidationPipe(refreshSchema))
    async refresh(@Body() body: RefreshDto): Promise<TokensDto> {
        return this.authService.refreshToken(body.username, body.refreshToken);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiOkResponse({ description: responseMessage.success, type: IReturnUser })
    @ApiBadRequestResponse({ description: responseMessage.badRequest })
    @ApiBearerAuth()
    async profile(@Req() req: Request): Promise<IReturnUser> {
        const user = this.userService.findOneById(req.user['id']);
        if (!user) throw new BadRequestException('User not found');
        return this.userService.getBasicUserInfo(user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @ApiOkResponse({ description: responseMessage.success, type: Boolean })
    @ApiBadRequestResponse({ description: responseMessage.badRequest })
    @ApiBearerAuth()
    async logout(@Req() req: Request): Promise<{ success: boolean }> {
        await this.authService.logout(req.user);
        return { success: true };
    }
}