import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/config/db.config';
import { CategoriesService } from 'src/modules/categories/categories.service';

import { ExpenseType } from '@prisma/client';
import { CreateExpenseDto, UpdateExpenseDto } from './dto';

import {
  collectionKey,
  fieldKey,
  messages,
  responseMessage,
} from 'src/common/text';
import { getEndOfDay, getStartOfDay } from 'src/common/utils';

@Injectable()
export class ExpensesService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => CategoriesService))
    private categoriesService: CategoriesService,
  ) {}

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
    let type = data.type;
    if (data.categoryId) {
      const category = await this.categoriesService.findOneById(
        data.categoryId,
      );
      if (!category)
        throw new NotFoundException(
          responseMessage.notFound(collectionKey.category),
        );
      type = category.type;
    }

    return await this.prisma.expense.create({
      data: {
        userId: data.userId,
        type,
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
    const expense = await this.prisma.expense.findFirst({
      where: { id, isDeleted: false },
      select: { categoryId: true },
    });
    if (!expense)
      throw new NotFoundException(
        responseMessage.notFound(collectionKey.expense),
      );

    if (data.categoryId) {
      const updateCategory = await this.categoriesService.findOneById(
        data.categoryId,
      );
      if (!updateCategory)
        throw new NotFoundException(
          responseMessage.notFound(collectionKey.category),
        );
      if (expense.categoryId && expense.categoryId !== data.categoryId) {
        const currentCategory = await this.categoriesService.findOneById(
          expense.categoryId,
        );
        if (currentCategory.type !== updateCategory.type) {
          throw new BadRequestException(
            messages.cannotUpdate(fieldKey.expenseType, collectionKey.expense),
          );
        }
      }
    }

    return await this.prisma.expense.update({
      where: { id, isDeleted: false },
      data: {
        value: data.value,
        description: data.description,
        date: data.date,
        categoryId: data.categoryId === 0 ? null : data.categoryId,
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

  async getExpensesAndCategoryNameByUserIdWithinTimeRange(
    userId: number,
    startDate: Date,
    endDate: Date,
  ) {
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
        },
      },
      omit: {
        id: true,
        userId: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
      },
    });
  }
}
