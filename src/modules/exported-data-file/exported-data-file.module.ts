import { Module } from '@nestjs/common';
import { ExportedDataFileController } from './exported-data-file.controller';
import { ExportedDataFileService } from './exported-data-file.service';
import { MulterModule } from '@nestjs/platform-express';
import { ExpensesModule } from '../expenses/expenses.module';
import { CloudStorageModule } from '../cloud-storage/cloud-storage.module';
import { MulterConfigService } from 'src/config/multer.config';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';

@Module({
  imports: [
    MulterModule.register(
      new MulterConfigService('exported_data_files', false).createMulterOptions(),
    ),
    CloudStorageModule,
    ExpensesModule,
  ],
  controllers: [ExportedDataFileController],
  providers: [ExportedDataFileService, CloudStorageService],
  exports: [ExportedDataFileService],
})
export class ExportedDataFileModule {}
