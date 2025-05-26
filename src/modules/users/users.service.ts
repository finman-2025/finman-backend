import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/config/db.config';

import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: { username, isDeleted: false },
      omit: { createdAt: true, updatedAt: true, isDeleted: true },
    });
  }

  async findOneById(id: number) {
    return await this.prisma.user.findUnique({
      where: { id: id, isDeleted: false },
      omit: { createdAt: true, updatedAt: true, isDeleted: true },
    });
  }

  async findManyUsersBySearchString(searchString: string) {
    return await this.prisma.user.findMany({
      where: {
        username: { contains: searchString },
        isDeleted: false,
      },
      omit: { createdAt: true, updatedAt: true, isDeleted: true },
    });
  }

  async createOne(data: CreateUserDto) {
    return await this.prisma.user.create({
      data: {
        username: data.username,
        password: data.password,
        email: data.email,
        name: data.name,
      },
      omit: { createdAt: true, updatedAt: true, isDeleted: true },
    });
  }

  async updateOneById(id: number, data: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id, isDeleted: false },
      data: {
        email: data.email,
        name: data.name,
        phoneNumber: data.phoneNumber,
      },
      omit: { createdAt: true, updatedAt: true, isDeleted: true },
    });
  }

  async deleteOneById(id: number) {
    return await this.prisma.user.update({
      where: { id },
      data: { isDeleted: true },
      omit: { createdAt: true, updatedAt: true, isDeleted: true },
    });
  }
}
