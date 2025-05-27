import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    NotImplementedException,
    ServiceUnavailableException
} from "@nestjs/common";

import * as fs from 'fs';
import { promisify } from "util";
import { createObjectCsvWriter } from 'csv-writer';

import { Storage } from '@google-cloud/storage';

import { PrismaService } from "src/config/db.config";
import { collectionKey, fieldKey, messages, responseMessage } from "src/common/text";

import { ExpensesService } from "../expenses/expenses.service";
import * as path from "path";

const unlinkAsync = promisify(fs.unlink);
const fsReadFileAsync = promisify(fs.readFile);

@Injectable()
export class ExportedDataFileService {
    private readonly storage: Storage;
    private readonly bucketName: string;
    private readonly bucketFolderName = 'exported_data_files';
    private readonly multerFolderName = 'uploads/exported_data_files';

    constructor(
        private prisma: PrismaService,
        private readonly expensesService: ExpensesService,
    ) {
        this.storage = new Storage({
            keyFilename: process.env.GOOGLE_JSON_KEY_PATH,
            projectId: process.env.GOOGLE_PROJECT_ID,
        });
        this.bucketName = process.env.GOOGLE_STORAGE_BUCKET_NAME;
    }

    async uploadFile(userId: number, filePath: string, fileName: string, fileType: string) {
        const file = await fsReadFileAsync(filePath);
        if (!file)
            throw new InternalServerErrorException(responseMessage.notFound(fieldKey.file));

        const bucket = this.storage.bucket(this.bucketName);
        const destination = `${this.bucketFolderName}/${userId}/${fileName}`;
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
    }

    async deleteFile(userId: number, fileName: string): Promise<void> {
        const filePath = this.getFileUrl(userId, fileName);

        const fileExists = await this.prisma.exportedDataFile.findFirst({
            where: { userId, fileName, isDeleted: false },
            omit: { createdAt: true, updatedAt: true, isDeleted: true },
        });
        if (!fileExists)
            throw new NotFoundException(responseMessage.notFound(collectionKey.exportedDataFile));

        // await this.storage.bucket(this.bucketName).file(filePath).delete();
        // await this.prisma.exportedDataFile.delete({
        //     where: { id: fileExists.id },
        // });
        
        // Soft delete
        await this.prisma.exportedDataFile.update({
            where: { id: fileExists.id },
            data: { isDeleted: true },
        });
    }

    getFileUrl(userId: number, fileName: string): string {
        return `${this.bucketFolderName}/${userId}/${fileName}`;
    }

    async listUserExportedFiles(userId: number) {
        const fileInfos = await this.prisma.exportedDataFile.findMany({
            where: { userId, isDeleted: false },
            omit: { id: true, userId: true, createdAt: true, updatedAt: true, isDeleted: true },
        });
    
        return fileInfos;
    }

    async fetchUserExportedFile(userId: number, fileName: string): Promise<NodeJS.ReadableStream> {
        const fileInfo = await this.prisma.exportedDataFile.findFirst({
            where: {
                userId: userId,
                fileName: fileName
            },
            omit: { id: true, userId: true, createdAt: true, updatedAt: true }
        });
        if (!fileInfo)
            throw new NotFoundException(responseMessage.notFound(collectionKey.exportedDataFile));

        const bucket = this.storage.bucket(this.bucketName);
        const filePath = this.getFileUrl(userId, fileName);

        const [file] = await bucket.file(filePath).exists();

        if (!file)
            throw new NotFoundException(responseMessage.notFound(collectionKey.exportedDataFile));

        const fileBlob = bucket.file(filePath);
        return fileBlob.createReadStream();
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

        if (!expensesData || expensesData.length === 0)
            throw new NotFoundException(responseMessage.notFound(collectionKey.expense));

        const formatData = expensesData.map(expense => ({
            date: expense.date.toISOString().replace('T', ' ').split('.')[0],
            description: expense.description,
            value: expense.value,
            category: expense.category.name,
            type: expense.type,
        }));

        const fileName = `expenses_${userId}_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}.${fileType}`;
        const filePath = path.resolve(`${this.multerFolderName}/${fileName}`);

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
            throw new NotImplementedException(responseMessage.notImplemented);
        } else {
            throw new BadRequestException(responseMessage.badRequest(fieldKey.fileType));
        }
    }
}