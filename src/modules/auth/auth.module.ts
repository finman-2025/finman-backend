import { Module } from "@nestjs/common";
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategeis/local.strategy';
import { JwtStrategy } from './strategeis/jwt.strategy';
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET', 'default_secret'),
                signOptions: { expiresIn: '15m' },
            }),
            inject: [ConfigService],
        }),
        UsersModule
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule {}