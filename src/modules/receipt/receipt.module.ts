import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';

@Module({
    imports: [
        MulterModule.register({
            storage: diskStorage({
                destination: './uploads/receipts',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                const allowedTypes = ['image/jpeg', 'image/png'];
                if (allowedTypes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'), false);
                }
            },
            limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
        }),
    ],
    controllers: [ReceiptController],
    providers: [ReceiptService],
})
export class ReceiptModule { }