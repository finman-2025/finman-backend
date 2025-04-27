import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation
} from '@nestjs/swagger';

import { 
    collectionKey,
    messages,
    responseMessage,
    summaries
} from 'src/common/text';
import { 
    ExceptionDto,
    idSchema
} from 'src/common/dto';
import { Request } from 'express';

import { ExpensesService } from './expenses.service';
import { 
    ICreateExpense,
    IReturnExpense,
    IUpdateExppense
} from './interfaces';
import { 
    CreateExpenseDto,
    createExpenseSchema,
    UpdateExpenseDto,
    updateExpenseSchema
} from './dto';

import { ZodValidationPipe } from 'src/pipes/validation.pipe';

import { UsersService } from '../users/users.service';
import { CategoriesService } from '../categories/categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('expenses')
export class ExpensesController {
    constructor(
        private readonly expensesService: ExpensesService,
        private readonly usersService: UsersService,
        private readonly categoriesService: CategoriesService
    ) {}

    @UseGuards(JwtAuthGuard)
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

    @UseGuards(JwtAuthGuard)
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

    @UseGuards(JwtAuthGuard)
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
    @ApiBody({ type: IUpdateExppense })
    async updateExpense(
        @Param('id', new ZodValidationPipe(idSchema)) id: number,
        @Body(new ZodValidationPipe(updateExpenseSchema)) body: UpdateExpenseDto
    ): Promise<IReturnExpense> {
        const expense = await this.expensesService.updateOneById(id, body);
        if (!expense) {
            throw new NotFoundException(messages.notFound(collectionKey.expense));
        }
        return expense;
    }

    @UseGuards(JwtAuthGuard)
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

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: summaries.getMany(collectionKey.expense) })
    @ApiOkResponse({ description: responseMessage.success, type: [IReturnExpense]})
    @ApiNotFoundResponse({
        description: responseMessage.notFound,
        type: ExceptionDto
    })
    async getExpensesByUserId(@Req() req: Request): Promise<IReturnExpense[]> {
        const user = await this.usersService.findOneById(req.user['id']);
        if (!user) {
            throw new NotFoundException(messages.notFound(collectionKey.user));
        }
        return await this.expensesService.findManyByCategoryId(req.user['id']);
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    @ApiOperation({ summary: summaries.deleteMany(collectionKey.expense) })
    @ApiOkResponse({ description: responseMessage.success })
    @ApiNotFoundResponse({
        description: responseMessage.notFound,
        type: ExceptionDto
    })
    @ApiBadRequestResponse({
        description: responseMessage.badRequest,
        type: ExceptionDto
    })
    async deleteAllExpensesByUserId(
        @Query('categoryId', new ZodValidationPipe(idSchema)) categoryId: number
    ): Promise<Boolean> {
        const category = await this.categoriesService.findOneById(categoryId);
        if (!category) {
            throw new NotFoundException(messages.notFound(collectionKey.category));
        }
        await this.expensesService.deleteAllCategoryExpenses(categoryId);
        return true;
    }
}