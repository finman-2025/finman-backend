import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/db.config';

import type { CreateCategoryDto } from './dto';

import { fieldKey, messages } from 'src/common/text';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    return await this.prisma.category.findMany({
      where: { userId, isDeleted: false },
      omit: { createdAt: true, updatedAt: true, isDeleted: true },
    });
  }

  async findOneById(id: number) {
    return await this.prisma.category.findFirst({
      where: { id, isDeleted: false },
      omit: { createdAt: true, updatedAt: true, isDeleted: true },
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
      data: { name: data.name, limit: data.limit, userId },
      omit: { createdAt: true, updatedAt: true, isDeleted: true },
    });
  }

  async update(id: number, data: CreateCategoryDto) {
    return await this.prisma.category.update({
      where: { id, isDeleted: false },
      data: { name: data.name, limit: data.limit },
      omit: { createdAt: true, updatedAt: true, isDeleted: true },
    });
  }

  async delete(id: number) {
    return await this.prisma.category.update({
      where: { id },
      data: { isDeleted: true },
      omit: { createdAt: true, updatedAt: true, isDeleted: true },
    });
  }
}
