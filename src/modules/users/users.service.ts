import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/config/db.config';

import { CreateUserDto, UpdateUserDto } from './dto';
import { collectionKey, fieldKey, responseMessage } from 'src/common/text';

import { CloudStorageService } from '../cloud-storage/cloud-storage.service';
import { IReturnUser, IUser } from './interfaces';

@Injectable()
export class UsersService {
  private readonly bucketFolderName = 'avatars';

  constructor(
    private prisma: PrismaService,
    private cloudStorageService: CloudStorageService,
  ) {}

  extractProfileData(user: IUser): IReturnUser {
    if (!user) 
      throw new InternalServerErrorException(responseMessage.internalServerError);

    return {
      username: user.username,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      phoneNumber: user.phoneNumber,
      address: user.address,
      sex: user.sex,
      dateOfBirth: user.dateOfBirth,
    }
  }

  async findOneByUsername(username: string): Promise<IUser | null> {
    return await this.prisma.user.findUnique({
      where: { username, isDeleted: false }
    });
  }

  async findOneById(id: number): Promise<IUser | null> {
    return await this.prisma.user.findUnique({
      where: { id: id, isDeleted: false }
    });
  }

  async findManyUsersBySearchString(searchString: string): Promise<IUser[] | null> {
    return await this.prisma.user.findMany({
      where: {
        username: { contains: searchString },
        isDeleted: false,
      }
    });
  }

  async createOne(data: CreateUserDto): Promise<IUser | null> {
    return await this.prisma.user.create({
      data: {
        username: data.username,
        password: data.password,
        email: data.email,
        name: data.name,
      }
    });
  }

  async updateOneById(id: number, data: UpdateUserDto): Promise<IUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id, isDeleted: false },
    });
    if (!user) 
      throw new NotFoundException(responseMessage.notFound(collectionKey.user));

    return await this.prisma.user.update({
      where: { id, isDeleted: false },
      data: {
        email: data.email,
        name: data.name,
        phoneNumber: data.phoneNumber,
        sex: data.sex,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
      }
    });
  }

  async deleteOneById(id: number): Promise<IUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id, isDeleted: false },
    });
    if (!user || user.isDeleted) 
      throw new NotFoundException(responseMessage.notFound(collectionKey.user));

    return await this.prisma.user.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async updatePassword(id: number, newPassword: string): Promise<IUser | null> {
    return await this.prisma.user.update({
      where: { id, isDeleted: false },
      data: { password: newPassword },
    });
  }

  async updateAvatar(userId: number, localFilePath: string, fileName: string, fileType: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, isDeleted: false },
    });

    if (!user) 
      throw new NotFoundException(responseMessage.notFound(collectionKey.user));

    if (user.avatar && user.avatar !== '') {
      await this.deleteAvatar(userId, user.avatar);
    }
    
    const cloudFilePath = this.cloudStorageService.getCloudFilePath(
      this.bucketFolderName,
      userId,
      fileName,
    );

    const publicUrl = await this.cloudStorageService.uploadFile(localFilePath, cloudFilePath, fileType);

    await this.prisma.user.update({
      where: { id: userId, isDeleted: false },
      data: {
        avatar: publicUrl,
      }
    });
    return publicUrl;
  }

  async deleteAvatar(userId: number, fileName?: string) {
    if (!fileName || fileName === '') {
      const user = await this.prisma.user.findUnique({
        where: { id: userId, isDeleted: false },
        omit: { createdAt: true, updatedAt: true, isDeleted: true },
      });
      
      if (!user) 
        throw new NotFoundException(responseMessage.notFound(collectionKey.user));
      if (!user.avatar || user.avatar === '')
        throw new NotFoundException(responseMessage.notFound(fieldKey.avatar));
    
      fileName = user.avatar.split('/').pop().split('?')[0];
    }

    const cloudFilePath = this.cloudStorageService.getCloudFilePath(
      this.bucketFolderName,
      userId,
      fileName,
    );
    await this.cloudStorageService.deleteFile(cloudFilePath);

    await this.prisma.user.update({
      where: { id: userId, isDeleted: false },
      data: { avatar: '' },
    });
  }
}
