import * as argon2 from 'argon2';
import { BadRequestException, Injectable, NotFoundException, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/config/db.config';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async hashPassword(password: string): Promise<string> {
        return argon2.hash(password);
    }

    async verifyPassword(hash: string, password: string): Promise<boolean> {
        return argon2.verify(hash, password);
    }

    async validateUser(username: string, password: string) {
        const user = await this.usersService.findOneByUsername(username);
        if (!user) throw new NotFoundException('Invalid credentials');

        const valid = await this.verifyPassword(user.password, password);
        if (!valid) throw new BadRequestException('Invalid credentials');

        return this.usersService.getBasicUserInfo(user);
    }

    async validateAccessTokenPayload(payload: any) {
        const user = await this.usersService.findOneById(payload.sub);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        return this.usersService.getBasicUserInfo(user);
    }

    async register(dto: RegisterDto) {
        const userExists = await this.usersService.findOneByUsername(dto.username);
        if (userExists) throw new BadRequestException('User already exists');

        const hash = await this.hashPassword(dto.password);
        const user = await this.prisma.user.create({
            data: {
                username: dto.username,
                password: hash,
                email: dto.email,
                name: dto.name
            }
        });
        if (!user) throw new ServiceUnavailableException('Can not create new user');
    
        return true;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.signAsync(payload),
        };
    }
}