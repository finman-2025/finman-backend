import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { ExpensesModule } from '../expenses/expenses.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [ExpensesModule],
})
export class CategoriesModule {}
