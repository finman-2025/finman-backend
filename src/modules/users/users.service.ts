import { Injectable, InternalServerErrorException, NotFoundException, ServiceUnavailableException } from '@nestjs/common';

import * as fs from 'fs';
import { promisify } from "util";

import { Storage } from '@google-cloud/storage';

import { PrismaService } from 'src/config/db.config';

import { CreateUserDto, UpdateUserDto } from './dto';
import { collectionKey, fieldKey, responseMessage } from 'src/common/text';

const unlinkAsync = promisify(fs.unlink);
const fsReadFileAsync = promisify(fs.readFile);

@Injectable()
export class UsersService {
  private readonly storage: Storage;
  private readonly bucketName: string;
  private readonly bucketFolderName = 'avatars';
  private readonly multerFolderName = 'uploads/avatars';

  constructor(private prisma: PrismaService) {
    this.storage = new Storage({
      keyFilename: process.env.GOOGLE_JSON_KEY_PATH,
      projectId: process.env.GOOGLE_PROJECT_ID,
    });
    this.bucketName = process.env.GOOGLE_STORAGE_BUCKET_NAME;
  }

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
        sex: data.sex,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
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

  async updatePassword(id: number, newPassword: string) {
    return await this.prisma.user.update({
      where: { id, isDeleted: false },
      data: { password: newPassword },
      omit: { createdAt: true, updatedAt: true, isDeleted: true },
    });
  }

  async updateAvatar(userId: number, filePath: string, fileName: string, fileType: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, isDeleted: false },
      omit: { createdAt: true, updatedAt: true, isDeleted: true },
    });

    if (!user) 
      throw new NotFoundException(responseMessage.notFound(collectionKey.user));

    if (user.avatar && user.avatar !== '') {
      await this.deleteAvatar(userId, user.avatar);
    }

    const avatarBuffer = await fsReadFileAsync(filePath);
    if (!avatarBuffer)
      throw new InternalServerErrorException(responseMessage.notFound(fieldKey.file));

    const bucket = this.storage.bucket(this.bucketName);
    const destination = `${this.bucketFolderName}/${userId}/${fileName}`;

    const gcsFile = bucket.file(destination);
    await gcsFile.save(avatarBuffer, {
      metadata: {
        contentType: fileType,
      },
    });

    await this.prisma.user.update({
      where: { id: userId, isDeleted: false },
      data: {
        avatar: fileName,
      }
    });
  }

  async deleteAvatar(userId: number, fileName?: string) {
    if (!fileName || fileName === '') {
      const user = await this.prisma.user.findUnique({
        where: { id: userId, isDeleted: false },
        omit: { createdAt: true, updatedAt: true, isDeleted: true },
      });
      
      if (!user || !user.avatar) 
        throw new NotFoundException(responseMessage.notFound(collectionKey.user));
    
      fileName = user.avatar;
    }

    const filePath = `${this.bucketFolderName}/${userId}/${fileName}`;
    const bucket = this.storage.bucket(this.bucketName);

    await bucket.file(filePath).delete();
    await this.prisma.user.update({
      where: { id: userId, isDeleted: false },
      data: { avatar: '' },
    });
  }

  async getAvatar(userId: number): Promise<NodeJS.ReadableStream> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, isDeleted: false },
      omit: { createdAt: true, updatedAt: true, isDeleted: true },
    });

    if (!user)
      throw new NotFoundException(responseMessage.notFound(collectionKey.user));
    if (!user.avatar || user.avatar === '')
      throw new NotFoundException(responseMessage.notFound(fieldKey.avatar));

    const filePath = `${this.bucketFolderName}/${userId}/${user.avatar}`;
    const bucket = this.storage.bucket(this.bucketName);
    const gcsFile = bucket.file(filePath);

    return gcsFile.createReadStream();
  }
}
