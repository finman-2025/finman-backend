import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query
} from '@nestjs/common';

import { ExpensesService } from './expenses.service';
import { ApiBadRequestResponse, ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { collectionKey, messages, responseMessage, summaries } from 'src/common/text';
import { ICreateExpense, IReturnExpense } from './interface';
import { ExceptionDto, idSchema } from 'src/common/dto';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { CreateExpenseDto, createExpenseSchema, UpdateExpenseDto } from './dto';
import { IUpdateCategory } from '../categories/interface';
import { UsersService } from '../users/users.service';

@Controller('expenses')
export class ExpensesController {
    constructor(
        private readonly expensesService: ExpensesService,
        private readonly usersService: UsersService
    ) {}

    @Get(':id')
    @ApiOperation({ summary: summaries.getOne(collectionKey.expense) })
    @ApiOkResponse({ description: responseMessage.success, type: IReturnExpense})
    @ApiNotFoundResponse({
        description: responseMessage.notFound,
        type: ExceptionDto
    })
    async getExpenseById(
        @Param('id', new ZodValidationPipe(idSchema)) id: number
    ): Promise<IReturnExpense> {
        const expense = await this.expensesService.findOneById(id);
        if (!expense) {
            throw new NotFoundException(messages.notFound(collectionKey.expense));
        }
        return expense;
    }

    @Post()
    @ApiOperation({ summary: summaries.create(collectionKey.expense) })
    @ApiOkResponse({ description: responseMessage.success, type: IReturnExpense})
    @ApiBadRequestResponse({
        description: responseMessage.badRequest,
        type: ExceptionDto
    })
    @ApiBody({ type: ICreateExpense })
    async createExpense(
        @Body(new ZodValidationPipe(createExpenseSchema)) body: CreateExpenseDto
    ): Promise<IReturnExpense> {
        const expense = await this.expensesService.createOne(body);
        if (!expense) {
            throw new NotFoundException(messages.notFound(collectionKey.expense));
        }
        return expense;
    }

    @Patch(':id')
    @ApiOperation({ summary: summaries.update(collectionKey.expense) })
    @ApiOkResponse({ description: responseMessage.success, type: IReturnExpense})
    @ApiNotFoundResponse({
        description: responseMessage.notFound,
        type: ExceptionDto
    })
    @ApiBadRequestResponse({
        description: responseMessage.badRequest,
        type: ExceptionDto
    })
    @ApiBody({ type: IUpdateCategory })
    async updateExpense(
        @Param('id', new ZodValidationPipe(idSchema)) id: number,
        @Body(new ZodValidationPipe(createExpenseSchema)) body: UpdateExpenseDto
    ): Promise<IReturnExpense> {
        const expense = await this.expensesService.updateOneById(id, body);
        if (!expense) {
            throw new NotFoundException(messages.notFound(collectionKey.expense));
        }
        return expense;
    }

    @Delete(':id')
    @ApiOperation({ summary: summaries.delete(collectionKey.expense) })
    @ApiOkResponse({ description: responseMessage.success })
    @ApiNotFoundResponse({
        description: responseMessage.notFound,
        type: ExceptionDto
    })
    async deleteExpense(
        @Param('id', new ZodValidationPipe(idSchema)) id: number
    ): Promise<Boolean> {
        const expense = await this.expensesService.findOneById(id);
        if (!expense) {
            throw new NotFoundException(messages.notFound(collectionKey.expense));
        }
        await this.expensesService.deleteOneById(id);
        return true;
    }

    @Get()
    @ApiOperation({ summary: summaries.getMany(collectionKey.expense) })
    @ApiOkResponse({ description: responseMessage.success, type: [IReturnExpense]})
    @ApiNotFoundResponse({
        description: responseMessage.notFound,
        type: ExceptionDto
    })
    async getExpensesByUserId(
        @Query('userId') userId: number
    ): Promise<IReturnExpense[]> {
        const user = await this.usersService.findOneById(userId);
        if (!user) {
            throw new NotFoundException(messages.notFound(collectionKey.user));
        }
        return await this.expensesService.findManyByUserId(userId);
    }

    @Delete()
    @ApiOperation({ summary: summaries.deleteMany(collectionKey.expense) })
    @ApiOkResponse({ description: responseMessage.success })
    @ApiNotFoundResponse({
        description: responseMessage.notFound,
        type: ExceptionDto
    })
    async deleteAllExpensesByUserId(
        @Query('userId') userId: number
    ): Promise<Boolean> {
        const user = await this.usersService.findOneById(userId);
        if (!user) {
            throw new NotFoundException(messages.notFound(collectionKey.user));
        }
        await this.expensesService.deleteAllUsersExpenses(userId);
        return true;
    }
}