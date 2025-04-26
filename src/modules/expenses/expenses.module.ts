import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { UsersService } from '../users/users.service';
import { CategoriesService } from '../categories/categories.service';

@Module({
    controllers: [ExpensesController],
    providers: [ExpensesService, UsersService, CategoriesService],
    exports: [ExpensesService]
})
export class ExpensesModule {}