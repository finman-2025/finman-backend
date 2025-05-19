import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Storage } from '@google-cloud/storage';
import * as fs from 'fs';

import { PrismaService } from "src/config/db.config";

@Injectable()
export class ExportedDataFileService {
    private readonly storage: Storage;
    private readonly bucketName: string;
    private readonly bucketPath: string;

    constructor(
        private prisma: PrismaService,
    ) {
        this.storage = new Storage({
            keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
            projectId: process.env.GOOGLE_APPLICATION_PROJECT_ID,
        });
        this.bucketName = process.env.GOOGLE_STORAGE_BUCKET_NAME;
        this.bucketPath = process.env.GOOGLE_STORAGE_BUCKET_PATH;
    }

    async uploadFile(file: Express.Multer.File, userId: string, fileName: string, fileType: string) {
        try {
            const bucket = this.storage.bucket(this.bucketName);
            const destination = `${userId}/${fileName}`;
            const gcsFile = bucket.file(destination);

            await gcsFile.save(file.buffer, {
                metadata: {
                    contentType: file.mimetype
                },
            });

            return `${this.bucketPath}/${this.bucketName}/${destination}`;
        } catch (error) {
            throw new InternalServerErrorException('Failed to export data');
        }
    }

    async deleteFile(filePath: string): Promise<void> {
        await this.storage.bucket(this.bucketName).file(filePath).delete();
    }

    getFileUrl(fileName: string): string {
        return `${this.bucketPath}/${this.bucketName}/${fileName}`;
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
            prefix: `${this.bucketPath}/${userId}/`,
        });

        for (const obj of objects) {
            files.push({ name: obj.name, baseUrl: obj.baseUrl });
        }

        return files;
    }

    async fetchUserExportedFile(userId: number, fileName: string): Promise<NodeJS.ReadableStream> {
        const fileInfo = await this.prisma.exportedDataFile.findFirst({
            where: { userId, fileName },
            omit: { id: true, userId: true, createdAt: true, updatedAt: true }
        });
        if (!fileInfo) {
            throw new InternalServerErrorException('File not found');
        }

        const bucket = this.storage.bucket(this.bucketName);
        try {
            const [file] = await bucket.file(`${fileInfo.filePath}.${fileInfo.fileType}`).exists();

            if (file) {
                const fileBlob = bucket.file(`${fileInfo.filePath}.${fileInfo.fileType}`);
                return fileBlob.createReadStream();
            } else {
                throw new InternalServerErrorException('File not found');
            }
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch file');
        }
      }
}