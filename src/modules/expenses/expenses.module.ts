import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { UsersService } from '../users/users.service';

@Module({
    controllers: [ExpensesController],
    providers: [ExpensesService, UsersService],
    exports: [ExpensesService]
})
export class ExpensesModule {}