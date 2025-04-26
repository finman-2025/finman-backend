import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/db.config';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByUsernameAndPassword(username: string, password: string) {
    return await this.prisma.user.findFirst({
      where: { username, password },
      omit: { username: true, password: true },
    });
  }

  async findOneByUsername(username: string) {
    return await this.prisma.user.findFirst({
      where: { username },
      omit: { username: true, password: true, createdAt: true, updatedAt: true },
    });
  }

  async findOneById(id: number) {
    return await this.prisma.user.findFirst({
      where: { id },
      omit: { username: true, password: true, createdAt: true, updatedAt: true },
    });
  }

  async findManyUsersBySearchString(searchString: string) {
    return await this.prisma.user.findMany({
      where: {
        username: {
          contains: searchString
        }
      },
      omit: { username: true, password: true, createdAt: true, updatedAt: true },
    });
  }

  async createOne(data: CreateUserDto) {
    return await this.prisma.user.create({
      data: {
        username: data.username,
        password: data.password,
        email: data.email,
        name: data.name
      }
    });
  }

  async updateOneById(id: number, data: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        name: data.name,
        phoneNumber: data.phoneNumber
      },
      omit: { username: true, password: true, createdAt: true, updatedAt: true },
    })
  }

  async deleteOneById(id: number) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
