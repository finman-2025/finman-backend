import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";

import * as fs from 'fs';
import { promisify } from "util";

import { Storage } from '@google-cloud/storage';

import { PrismaService } from "src/config/db.config";
import { collectionKey, messages, responseMessage } from "src/common/text";

const unlinkAsync = promisify(fs.unlink);
const fsReadFileAsync = promisify(fs.readFile);

@Injectable()
export class ExportedDataFileService {
    private readonly storage: Storage;
    private readonly bucketName: string;
    private readonly bucketPath: string;

    constructor(
        private prisma: PrismaService,
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

            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return link;
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
            prefix: `${this.bucketPath}/${userId}/`,
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
            throw new InternalServerErrorException('File not found');
        }

        const bucket = this.storage.bucket(this.bucketName);
        const filePath = this.getFileUrl(userId, fileName);
        try {
            const [file] = await bucket.file(filePath).exists();

            if (file) {
                const fileBlob = bucket.file(filePath);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return fileBlob.createReadStream();
            } else {
                throw new InternalServerErrorException('File not found');
            }
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch file');
        }
      }
}