import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/db.config';
import { CreateExpenseDto, UpdateExpenseDto } from './dto';

import { getEndOfDay, getStartOfDay } from 'src/common/utils';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async createOne(data: CreateExpenseDto) {
    return await this.prisma.expense.create({
      data: {
        userId: data.userId,
        value: data.value,
        description: data.description,
        date: data.date,
        categoryId: data.categoryId,
      },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async findMany(userId: number, categoryId?: number, date?: Date) {
    const filterDate = date
      ? { gte: getStartOfDay(date), lte: getEndOfDay(date) }
      : undefined;

    return await this.prisma.expense.findMany({
      where: {
        userId,
        categoryId,
        date: filterDate,
      },
      orderBy: { date: 'desc' },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async findOneById(id: number) {
    return await this.prisma.expense.findFirst({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async updateOneById(id: number, data: UpdateExpenseDto) {
    return await this.prisma.expense.update({
      where: { id },
      data: {
        value: data.value,
        description: data.description,
        date: data.date,
        categoryId: data.categoryId,
      },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async deleteOneById(id: number) {
    return await this.prisma.expense.delete({ where: { id } });
  }

  async deleteAllCategoryExpenses(categoryId: number) {
    return await this.prisma.expense.deleteMany({ where: { categoryId } });
  }
}
