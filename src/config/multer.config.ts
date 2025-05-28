import { BadRequestException, Injectable } from '@nestjs/common';
import {
  MulterOptionsFactory,
  MulterModuleOptions,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

import { allowedImageSize, allowedImageTypes } from 'src/common/utils';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private readonly folder: string) {}

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
        if (allowedImageTypes.includes(file.mimetype)) cb(null, true);
        else
          cb(
            new BadRequestException(
              'Invalid file type. Only JPG, JPEG, PNG allowed.',
            ),
            false,
          );
      },
      limits: { fileSize: allowedImageSize },
    };
  }
}
