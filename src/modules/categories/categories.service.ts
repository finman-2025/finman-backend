import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/db.config';

import type { CreateCategoryDto } from './dto';

import { fieldKey, messages } from 'src/common/text';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    return await this.prisma.category.findMany({
      where: { userId },
    });
  }

  async findOneById(id: number) {
    return await this.prisma.category.findFirst({
      where: { id },
    });
  }

  async create(data: CreateCategoryDto, userId: number) {
    const category = await this.prisma.category.findFirst({
      where: { name: data.name, userId },
    });

    if (category) {
      throw new BadRequestException(messages.nameExists(fieldKey.categoryName));
    }

    return await this.prisma.category.create({
      data: { name: data.name, limit: data.limit, userId },
    });
  }

  async update(id: number, data: CreateCategoryDto) {
    return await this.prisma.category.update({
      where: { id },
      data: { name: data.name, limit: data.limit },
    });
  }

  async delete(id: number) {
    return await this.prisma.category.delete({
      where: { id },
    });
  }
}
