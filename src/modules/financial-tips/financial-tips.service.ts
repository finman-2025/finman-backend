import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/db.config';
import { CreateFinancialTipDto } from './dto';

@Injectable()
export class FinancialTipsService {
  constructor(private prisma: PrismaService) {}

  async createOne(data: CreateFinancialTipDto) {
    return this.prisma.financialTip.create({
      data: {
        author: data.author,
        authorImage: data.authorImage,
        content: data.content,
        title: data.title,
        type: data.type,
      },
      omit: { createdAt: true, updatedAt: true, isDeleted: true },
    });
  }

  async findAll(type?: string) {
    return this.prisma.financialTip.findMany({
      where: { type: type, isDeleted: false },
      omit: { createdAt: true, updatedAt: true, isDeleted: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.financialTip.findFirst({
      where: { id, isDeleted: false },
      omit: { createdAt: true, updatedAt: true, isDeleted: true },
    });
  }

  async updateOne(id: number, data: CreateFinancialTipDto) {
    return this.prisma.financialTip.update({
      where: { id, isDeleted: false },
      data: {
        author: data.author,
        authorImage: data.authorImage,
        content: data.content,
        title: data.title,
        type: data.type,
      },
      omit: { createdAt: true, updatedAt: true, isDeleted: true },
    });
  }

  async deleteOne(id: number) {
    return this.prisma.financialTip.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
