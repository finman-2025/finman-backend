import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from 'src/config/db.config';

import { fieldKey, messages } from 'src/common/text';

import { ExpenseType } from '@prisma/client';
import type { CreateCategoryDto } from './dto';

import { ExpensesService } from 'src/modules/expenses/expenses.service';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => ExpensesService))
    private expensesService: ExpensesService,
  ) {}

  async findAll(userId: number) {
    console.log(userId);
    const categories = await this.prisma.category.findMany({
      where: { userId, isDeleted: false },
      orderBy: { id: 'asc' },
      omit: { userId: true, createdAt: true, updatedAt: true, isDeleted: true },
    });

    return [...categories, { id: 0, name: fieldKey.other }];
  }

  async findAllWithExpenseValue(
    userId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const categories = await this.prisma.category.findMany({
      where: { userId, isDeleted: false },
      select: { id: true, name: true, limit: true, type: true },
      orderBy: { id: 'asc' },
    });

    categories.push({
      id: 0,
      name: fieldKey.other,
      limit: undefined,
      type: undefined,
    });

    return Promise.all(
      categories.map(async (category) => {
        const expenseValue = await this.expensesService.getTotalExpenseValue(
          userId,
          category.id,
          startDate,
          endDate,
        );
        return { ...category, expenseValue };
      }),
    );
  }

  async findOneById(id: number) {
    return await this.prisma.category.findFirst({
      where: { id, isDeleted: false },
      omit: { userId: true, createdAt: true, updatedAt: true, isDeleted: true },
    });
  }

  async create(data: CreateCategoryDto, userId: number) {
    const category = await this.prisma.category.findFirst({
      where: { name: data.name, userId, isDeleted: false },
    });

    if (category) {
      throw new BadRequestException(messages.nameExists(fieldKey.categoryName));
    }

    return await this.prisma.category.create({
      data: {
        name: data.name,
        limit: data.type === ExpenseType.OUTCOME ? data.limit : undefined,
        type: data.type,
        image: data.image,
        userId,
      },
      omit: { userId: true, createdAt: true, updatedAt: true, isDeleted: true },
    });
  }

  async update(id: number, data: CreateCategoryDto) {
    return await this.prisma.category.update({
      where: { id, isDeleted: false },
      data: { name: data.name, limit: data.limit, image: data.image },
      omit: { userId: true, createdAt: true, updatedAt: true, isDeleted: true },
    });
  }

  async delete(id: number) {
    return await this.prisma.category.update({
      where: { id },
      data: { isDeleted: true },
      omit: { userId: true, createdAt: true, updatedAt: true, isDeleted: true },
    });
  }
}
