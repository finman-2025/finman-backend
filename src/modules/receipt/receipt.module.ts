import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';

import { MulterConfigService } from 'src/config/multer.config';

@Module({
  imports: [
    MulterModule.register(
      new MulterConfigService('receipts', true).createMulterOptions(),
    ),
  ],
  controllers: [ReceiptController],
  providers: [ReceiptService],
})
export class ReceiptModule {}
