import { forwardRef, Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { UsersService } from '../users/users.service';
import { CategoriesService } from '../categories/categories.service';
import { CategoriesModule } from '../categories/categories.module';
import { CloudStorageModule } from '../cloud-storage/cloud-storage.module';

@Module({
  controllers: [ExpensesController],
  providers: [ExpensesService, UsersService, CategoriesService],
  imports: [forwardRef(() => CategoriesModule), CloudStorageModule],
  exports: [ExpensesService],
})
export class ExpensesModule {}
