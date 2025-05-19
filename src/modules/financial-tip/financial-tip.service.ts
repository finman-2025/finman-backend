import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/db.config";
import { CreateFinancialTipDto } from "./dto";

@Injectable()
export class FinancialTipService {
    constructor(
        private prisma: PrismaService
    ) {}

    async createOne(data: CreateFinancialTipDto) {
        return this.prisma.financialTip.create({
            data: {
                author: data.author,
                authorImage: data.authorImage,
                content: data.content,
                title: data.title,
                type: data.type,
            },
            omit: { id: true, createdAt: true, updatedAt: true }
        });
    }

    async findOne(id: number) {
        return this.prisma.financialTip.findFirst({
            where: { id },
            omit: { id: true, createdAt: true, updatedAt: true }
        });
    }

    async findAllWithType(type: string) {
        return this.prisma.financialTip.findMany({
            where: { type: type },
            omit: { id: true, createdAt: true, updatedAt: true }
        });
    }

    async updateOne(id: number, data: CreateFinancialTipDto) {
        return this.prisma.financialTip.update({
            where: { id },
            data: {
                author: data.author,
                authorImage: data.authorImage,
                content: data.content,
                title: data.title,
                type: data.type,
            },
            omit: { id: true, createdAt: true, updatedAt: true }
        });
    }

    async deleteOne(id: number) {
        return this.prisma.financialTip.delete({
            where: { id }
        });
    }
}