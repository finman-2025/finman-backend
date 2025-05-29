import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import * as fs from 'fs';
import { promisify } from 'util';

import { Storage } from '@google-cloud/storage';

import { collectionKey, messages, responseMessage } from 'src/common/text';

import { ConfigService } from '@nestjs/config';

const unlinkAsync = promisify(fs.unlink);
const fsReadFileAsync = promisify(fs.readFile);

@Injectable()
export class CloudStorageService {
  private readonly storage: Storage;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    this.storage = new Storage({
      keyFilename:
        this.configService.get<string>('GOOGLE_JSON_KEY_PATH') ||
        './certs/google-cloud-api-key.json',
    });
    this.bucketName = this.configService.get<string>(
      'GOOGLE_STORAGE_BUCKET_NAME',
    );
  }

  async uploadFile(
    localFilePath: string,
    cloudFilePath: string,
    fileType: string,
  ) {
    try {
      const file = await fsReadFileAsync(localFilePath);
      if (!file)
        throw new InternalServerErrorException(
          responseMessage.internalServerError,
        );

      const bucket = this.storage.bucket(this.bucketName);
      const gcsFile = bucket.file(cloudFilePath);

      await gcsFile.save(file, {
        metadata: { contentType: fileType },
      });

      await unlinkAsync(localFilePath);

      return gcsFile.publicUrl().replaceAll('%2F', '/');
    } catch (error) {
      console.error('uploadFile error:', error);
      throw new InternalServerErrorException('Failed to export data');
    }
  }

  async deleteFile(cloudFilePath: string): Promise<void> {
    await this.storage.bucket(this.bucketName).file(cloudFilePath).delete();
  }

  async getFile(cloudFilePath: string): Promise<NodeJS.ReadableStream> {
    const bucket = this.storage.bucket(this.bucketName);
    try {
      const [file] = await bucket.file(cloudFilePath).exists();

      if (file) {
        const fileBlob = bucket.file(cloudFilePath);
        return fileBlob.createReadStream();
      } else {
        throw new NotFoundException(
          messages.notFound(collectionKey.exportedDataFile),
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(
        responseMessage.internalServerError,
      );
    }
  }

  getCloudFilePath(folder: string, userId: number, fileName: string): string {
    return `${folder}/${userId}/${fileName}`;
  }

  getLocalFilePath(folder: string, userId: number, fileName: string): string {
    return `uploads/${folder}/${userId}/${fileName}`;
  }
}
