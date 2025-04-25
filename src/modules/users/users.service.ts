import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/db.config';

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
      omit: { username: true, password: true },
    });
  }

  async findOneById(id: number) {
    return await this.prisma.user.findFirst({
      where: { id },
      omit: { username: true, password: true },
    });
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
