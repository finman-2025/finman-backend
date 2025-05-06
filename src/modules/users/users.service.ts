import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/config/db.config';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByUsernameAndPassword(username: string, password: string) {
    return await this.prisma.user.findUnique({
      where: { username, password },
    });
  }

  async findOneByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findOneById(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findManyUsersBySearchString(searchString: string) {
    return await this.prisma.user.findMany({
      where: {
        username: {
          contains: searchString,
        },
      },
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
    });
  }

  async updateOneById(id: number, data: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        name: data.name,
        phoneNumber: data.phoneNumber,
      },
    });
  }

  async deleteOneById(id: number) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  getBasicUserInfo(user: any) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };
  }
}
