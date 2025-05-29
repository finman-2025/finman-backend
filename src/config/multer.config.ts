import { BadRequestException, Injectable } from '@nestjs/common';
import {
  MulterOptionsFactory,
  MulterModuleOptions,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

import {
  allowedFileSize,
  allowedFileTypes,
  allowedImageSize,
  allowedImageTypes,
} from 'src/common/utils';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(
    private readonly folder: string,
    private readonly isImage: boolean,
  ) {}

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = `./uploads/${this.folder}`;

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, `./uploads/${this.folder}`);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (this.isImage) {
          if (allowedImageTypes.includes(file.mimetype)) cb(null, true);
          else
            cb(
              new BadRequestException(
                'Invalid image file type. Only JPG, JPEG, PNG allowed.',
              ),
              false,
            );
        } else {
          if (allowedFileTypes.includes(file.mimetype)) cb(null, true);
          else
            cb(
              new BadRequestException('Invalid file type. Only CSV allowed.'),
              false,
            );
        }
      },
      limits: { fileSize: this.isImage ? allowedImageSize : allowedFileSize },
    };
  }
}
