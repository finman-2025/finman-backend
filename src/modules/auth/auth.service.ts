import { PrismaService } from "src/config/db.config";

export class AuthService {
    constructor(
        private prisma: PrismaService
    ) {}

    async hashPassword() {}

    async verifyPassword() {}

    async register() {}

    async login() {}

    async logout() {}

    async validateAccessToken() {}

    async refreshAccessToken() {}
}