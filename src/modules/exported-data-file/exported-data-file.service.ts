import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, ServiceUnavailableException } from "@nestjs/common";

import * as fs from 'fs';
import { promisify } from "util";
import { createObjectCsvWriter } from 'csv-writer';

import { Storage } from '@google-cloud/storage';

import { PrismaService } from "src/config/db.config";
import { collectionKey, messages, responseMessage } from "src/common/text";

import { ExpensesService } from "../expenses/expenses.service";
import * as path from "path";

const unlinkAsync = promisify(fs.unlink);
const fsReadFileAsync = promisify(fs.readFile);

@Injectable()
export class ExportedDataFileService {
    private readonly storage: Storage;
    private readonly bucketName: string;
    private readonly bucketPath: string;

    constructor(
        private prisma: PrismaService,
        private readonly expensesService: ExpensesService,
    ) {
        this.storage = new Storage({
            keyFilename: process.env.GOOGLE_JSON_KEY_PATH,
            projectId: process.env.GOOGLE_PROJECT_ID,
        });
        this.bucketName = process.env.GOOGLE_STORAGE_BUCKET_NAME;
        this.bucketPath = process.env.GOOGLE_STORAGE_BUCKET_PATH;
    }

    async uploadFile(userId: number, filePath: string, fileName: string, fileType: string) {
        try {
            const file = await fsReadFileAsync(filePath);
            if (!file) {
                throw new InternalServerErrorException(responseMessage.internalServerError);
            }

            const bucket = this.storage.bucket(this.bucketName);
            const destination = `exported_data_files/${userId}/${fileName}`;
            const gcsFile = bucket.file(destination);

            await gcsFile.save(file, {
                metadata: {
                    contentType: fileType
                },
            });
            const link = gcsFile.publicUrl();

            await this.prisma.exportedDataFile.create({
                data: {
                    userId: userId,
                    fileName: fileName,
                    fileType: fileType,
                    url: link,
                }
            });

            await unlinkAsync(filePath);

            return fileName;
        } catch (error) {
            console.error('uploadFile error:',error);
            throw new InternalServerErrorException('Failed to export data');
        }
    }

    async deleteFile(userId: number, fileName: string, filePath: string): Promise<void> {
        const fileExists = await this.prisma.exportedDataFile.findFirst({
            where: { userId, fileName },
            omit: { createdAt: true, updatedAt: true }
        });
        if (!fileExists) {
            throw new NotFoundException(messages.notFound(collectionKey.exportedDataFile));
        }

        await this.storage.bucket(this.bucketName).file(filePath).delete();
        await this.prisma.exportedDataFile.delete({
            where: { id: fileExists.id },
        });
    }

    getFileUrl(userId: number, fileName: string): string {
        return `exported_data_files/${userId}/${fileName}`;
    }

    async listUserExportedFiles(userId: number): Promise<any> {
        const fileInfos = await this.prisma.exportedDataFile.findMany({
            where: { userId },
            omit: { id: true, userId: true, createdAt: true, updatedAt: true }
        });
        if (!fileInfos) {
            return [];
        }

        const bucket = this.storage.bucket(this.bucketName);
        const files: any[] = [];

        const [objects] = await bucket.getFiles({
            prefix: `exported-date-files/${userId}/`,
        });

        for (const obj of objects) {
            files.push({ name: obj.name, baseUrl: obj.baseUrl });
        }

        return files;
    }

    async fetchUserExportedFile(userId: number, fileName: string): Promise<NodeJS.ReadableStream> {
        const fileInfo = await this.prisma.exportedDataFile.findFirst({
            where: {
                userId: userId,
                fileName: fileName
            },
            omit: { id: true, userId: true, createdAt: true, updatedAt: true }
        });
        if (!fileInfo) {
            throw new NotFoundException(messages.notFound(collectionKey.exportedDataFile));
        }

        const bucket = this.storage.bucket(this.bucketName);
        const filePath = this.getFileUrl(userId, fileName);
        try {
            const [file] = await bucket.file(filePath).exists();

            if (file) {
                const fileBlob = bucket.file(filePath);
                return fileBlob.createReadStream();
            } else {
                throw new NotFoundException(messages.notFound(collectionKey.exportedDataFile));
            }
        } catch (error) {
            throw new InternalServerErrorException(responseMessage.internalServerError);
        }
    }

    async exportExpensesToFile(
        userId: number,
        startDate: Date,
        endDate: Date,
        fileType: 'pdf' | 'csv',
    ) {
        const expensesData = await this.expensesService.getExpensesAndCategoryNameByUserIdWithinTimeRange(
            userId,
            startDate,
            endDate
        );

        if (!expensesData || expensesData.length === 0) {
            throw new NotFoundException(messages.notFound(collectionKey.expense));
        }

        const formatData = expensesData.map(expense => ({
            date: expense.date.toISOString().replace('T', ' ').split('.')[0],
            description: expense.description,
            value: expense.value,
            category: expense.category.name,
            type: expense.type,
        }));

        const fileName = `expenses_${userId}_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}.${fileType}`;
        const filePath = path.resolve(`uploads/exported_data_files/${fileName}`);

        if (fileType === 'csv') {
            const csvWriter = createObjectCsvWriter({
                path: path.resolve(filePath),
                header: [
                    { id: 'date', title: 'Date' },
                    { id: 'description', title: 'Description' },
                    { id: 'value', title: 'Value' },
                    { id: 'category', title: 'Category' },
                    { id: 'type', title: 'Type' },
                ],
            });

            await csvWriter.writeRecords(formatData);
            return await this.uploadFile(
                userId,
                path.resolve(filePath),
                fileName,
                'text/csv'
            );
        }
        else if (fileType === 'pdf') {
            // PDF generation logic would go here
            throw new ServiceUnavailableException('PDF export is not implemented yet');
        } else {
            throw new BadRequestException('Unsupported file type');
        }
    }
}