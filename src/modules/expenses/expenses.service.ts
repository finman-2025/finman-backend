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
      omit: { createdAt: true, updatedAt: true, isDeleted: true },
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
        isDeleted: false,
      },
      orderBy: { date: 'desc' },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
      omit: { createdAt: true, updatedAt: true, isDeleted: true },
    });
  }

  async findOneById(id: number) {
    return await this.prisma.expense.findFirst({
      where: { id, isDeleted: false },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
      omit: { createdAt: true, updatedAt: true, isDeleted: true },
    });
  }

  async updateOneById(id: number, data: UpdateExpenseDto) {
    return await this.prisma.expense.update({
      where: { id, isDeleted: false },
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
      omit: { createdAt: true, updatedAt: true, isDeleted: true },
    });
  }

  async deleteOneById(id: number) {
    return await this.prisma.expense.update({
      where: { id },
      data: { isDeleted: true },
      omit: { createdAt: true, updatedAt: true, isDeleted: true },
    });
  }

  async deleteAllCategoryExpenses(categoryId: number) {
    return await this.prisma.expense.updateMany({
      where: { categoryId },
      data: { isDeleted: true },
    });
  }
}
