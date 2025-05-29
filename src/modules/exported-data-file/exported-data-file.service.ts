import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';

import { createObjectCsvWriter } from 'csv-writer';
import * as path from 'path';

import { Storage } from '@google-cloud/storage';

import { PrismaService } from 'src/config/db.config';
import { collectionKey, fieldKey, responseMessage } from 'src/common/text';

import { ExpensesService } from '../expenses/expenses.service';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';

@Injectable()
export class ExportedDataFileService {
  private readonly storage: Storage;
  private readonly bucketName: string;
  private readonly bucketFolderName = 'exported_data_files';
  private readonly multerFolderName = 'uploads/exported_data_files';

  constructor(
    private prisma: PrismaService,
    private readonly expensesService: ExpensesService,
    private readonly cloudStorageService: CloudStorageService,
  ) {}

  async uploadFile(
    userId: number,
    localFilePath: string,
    fileName: string,
    fileType: string,
  ) {
    const cloudFilePath = `${this.bucketFolderName}/${userId}/${fileName}`;

    const link = await this.cloudStorageService.uploadFile(
      localFilePath,
      cloudFilePath,
      fileType,
    );

    return await this.prisma.exportedDataFile.create({
      data: {
        userId: userId,
        fileName: fileName,
        fileType: fileType,
        url: link,
      },
    });
  }

  async deleteFile(userId: number, fileName: string): Promise<void> {
    const fileExists = await this.prisma.exportedDataFile.findFirst({
      where: { userId, fileName, isDeleted: false },
      omit: { createdAt: true, updatedAt: true, isDeleted: true },
    });
    if (!fileExists)
      throw new NotFoundException(
        responseMessage.notFound(collectionKey.exportedDataFile),
      );

    // const cloudFilePath = this.cloudStorageService.getCloudFilePath(
    //   this.bucketFolderName,
    //   userId,
    //   fileName,
    // );
    // await this.cloudStorageService.deleteFile(cloudFilePath);

    // Soft delete
    await this.prisma.exportedDataFile.update({
      where: { id: fileExists.id },
      data: { isDeleted: true },
    });
  }

  async listUserExportedFiles(userId: number) {
    const fileInfos = await this.prisma.exportedDataFile.findMany({
      where: { userId, isDeleted: false },
      select: {
        fileName: true,
        url: true,
        createdAt: true,
      },
    });

    return fileInfos;
  }

  async exportExpensesToFile(
    userId: number,
    startDate: Date,
    endDate: Date,
    fileType: 'pdf' | 'csv',
  ) {
    const expensesData =
      await this.expensesService.getExpensesAndCategoryNameByUserIdWithinTimeRange(
        userId,
        startDate,
        endDate,
      );

    if (!expensesData || expensesData.length === 0)
      throw new NotFoundException(
        responseMessage.notFound(collectionKey.expense),
      );

    const formatData = expensesData.map((expense) => ({
      date: expense.date.toISOString().replace('T', ' ').split('.')[0],
      description: expense.description,
      value: expense.value,
      category: expense.category?.name ?? 'Khác',
      type: expense.type,
    }));

    const fileName = `expenses_${userId}_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}.${fileType}`;
    const localFilePath = path.resolve(`${this.multerFolderName}/${fileName}`);

    if (fileType === 'csv') {
      const csvWriter = createObjectCsvWriter({
        path: path.resolve(localFilePath),
        header: [
          { id: 'date', title: 'Date' },
          { id: 'description', title: 'Description' },
          { id: 'value', title: 'Value' },
          { id: 'category', title: 'Category' },
          { id: 'type', title: 'Type' },
        ],
      });

      await csvWriter.writeRecords(formatData);

      const fileDoc = await this.uploadFile(
        userId,
        localFilePath,
        fileName,
        'text/csv',
      );

      return {
        fileName: fileName,
        url: fileDoc.url,
        createdAt: fileDoc.createdAt,
      };
    } else if (fileType.includes('pdf')) {
      // PDF generation logic would go here
      throw new NotImplementedException(responseMessage.notImplemented);
    } else {
      throw new BadRequestException(
        responseMessage.badRequest(fieldKey.fileType),
      );
    }
  }
}
