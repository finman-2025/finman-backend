import { BadRequestException, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';

import { allowedImageSize, allowedImageTypes } from 'src/common/utils';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/receipts',
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
      limits: { fileSize: allowedImageSize }, // 5MB limit
    }),
  ],
  controllers: [ReceiptController],
  providers: [ReceiptService],
})
export class ReceiptModule {}
