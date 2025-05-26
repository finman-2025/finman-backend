import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/db.config';
import { CreateExpenseDto, UpdateExpenseDto } from './dto';

import { getEndOfDay, getStartOfDay } from 'src/common/utils';
import { ExpenseType } from '@prisma/client';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async findMany(userId: number, categoryId?: number, date?: Date) {
    return await this.prisma.expense.findMany({
      where: {
        userId,
        categoryId: categoryId === 0 ? null : categoryId,
        date: date
          ? { gte: getStartOfDay(date), lte: getEndOfDay(date) }
          : undefined,
        isDeleted: false,
      },
      orderBy: { date: 'desc' },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
      omit: { userId: true, createdAt: true, updatedAt: true, isDeleted: true },
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
      omit: { userId: true, createdAt: true, updatedAt: true, isDeleted: true },
    });
  }

  async createOne(data: CreateExpenseDto) {
    return await this.prisma.expense.create({
      data: {
        userId: data.userId,
        type: data.type,
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
      omit: { userId: true, createdAt: true, updatedAt: true, isDeleted: true },
    });
  }

  async getTotalExpenseValue(
    userId: number,
    categoryId?: number,
    startDate?: Date,
    endDate?: Date,
  ) {
    const expenses = await this.prisma.expense.findMany({
      where: {
        userId,
        categoryId: categoryId === 0 ? null : categoryId,
        date: {
          gte: startDate ? getStartOfDay(startDate) : undefined,
          lte: endDate ? getEndOfDay(endDate) : undefined,
        },
        isDeleted: false,
      },
      select: { value: true, type: true },
    });

    const spent = expenses
      .filter(({ type }) => type === ExpenseType.OUTCOME)
      .reduce((result, { value }) => result + value, 0);

    const earned = expenses
      .filter(({ type }) => type === ExpenseType.INCOME)
      .reduce((result, { value }) => result + value, 0);

    return { spent, earned };
  }

  async updateOneById(id: number, data: UpdateExpenseDto) {
    return await this.prisma.expense.update({
      where: { id, isDeleted: false },
      data: {
        value: data.value,
        type: data.type,
        description: data.description,
        date: data.date,
        categoryId: data.categoryId,
      },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
      omit: { userId: true, createdAt: true, updatedAt: true, isDeleted: true },
    });
  }

  async deleteOneById(id: number) {
    return await this.prisma.expense.update({
      where: { id },
      data: { isDeleted: true },
      omit: { userId: true, createdAt: true, updatedAt: true, isDeleted: true },
    });
  }

  async deleteAllCategoryExpenses(categoryId: number) {
    return await this.prisma.expense.updateMany({
      where: { categoryId },
      data: { isDeleted: true },
    });
  }

  async getExpensesAndCategoryNameByUserIdWithinTimeRange(userId: number, startDate: Date, endDate: Date) {
    return await this.prisma.expense.findMany({
      where: {
        userId,
        isDeleted: false,
        date: {
          gte: startDate ? getStartOfDay(startDate) : undefined,
          lte: endDate ? getEndOfDay(endDate) : undefined,
        },
      },
      include: {
        category: {
          select: { name: true },
        }
      },
      omit: { id: true, userId: true, categoryId: true, createdAt: true, updatedAt: true, isDeleted: true },
    });
  }
}
