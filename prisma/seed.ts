import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const main = async () => {
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      username: 'cuong',
      password: '123456',
      email: 'cuong@gmail.com',
      phoneNumber: '0123456789',
    },
  });
};
