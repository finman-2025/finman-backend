import { forwardRef, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { MulterConfigService } from 'src/config/multer.config';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { ExpensesModule } from '../expenses/expenses.module';
import { CloudStorageModule } from '../cloud-storage/cloud-storage.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    forwardRef(() => ExpensesModule),
    MulterModule.register(
      new MulterConfigService('categories', true).createMulterOptions(),
    ),
    CloudStorageModule,
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
