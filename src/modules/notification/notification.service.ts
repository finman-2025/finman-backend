import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/db.config";

@Injectable()
export class NotificationService {
    constructor(
        private prisma: PrismaService,
    ) {}
    
}