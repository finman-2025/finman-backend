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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import {
  collectionKey,
  messages,
  responseMessage,
  summaries,
} from 'src/common/text';
import { ExceptionDto, idSchema } from 'src/common/dto';
import { Request } from 'express';

import { ExpensesService } from './expenses.service';
import { ICreateExpense, IReturnExpense, IUpdateExpense } from './interfaces';
import {
  CreateExpenseDto,
  createExpenseSchema,
  UpdateExpenseDto,
  updateExpenseSchema,
} from './dto';

import { ZodValidationPipe } from 'src/pipes/validation.pipe';

import { UsersService } from '../users/users.service';
import { CategoriesService } from '../categories/categories.service';

@Controller('expenses')
export class ExpensesController {
  constructor(
    private readonly expensesService: ExpensesService,
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.getOne(collectionKey.expense) })
  @ApiOkResponse({ description: responseMessage.success, type: IReturnExpense })
  @ApiNotFoundResponse({
    description: responseMessage.notFound,
    type: ExceptionDto,
  })
  async getExpenseById(
    @Param('id', new ZodValidationPipe(idSchema)) id: number,
  ): Promise<IReturnExpense> {
    const expense = await this.expensesService.findOneById(id);
    if (!expense) {
      throw new NotFoundException(messages.notFound(collectionKey.expense));
    }
    return expense;
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.create(collectionKey.expense) })
  @ApiOkResponse({ description: responseMessage.success, type: IReturnExpense })
  @ApiBadRequestResponse({
    description: responseMessage.badRequest,
    type: ExceptionDto,
  })
  @ApiBody({ type: ICreateExpense })
  async createExpense(
    @Req() req: Request,
    @Body(new ZodValidationPipe(createExpenseSchema)) body: CreateExpenseDto,
  ): Promise<IReturnExpense> {
    body.userId = req.user['id'];
    const expense = await this.expensesService.createOne(body);
    if (!expense) {
      throw new NotFoundException(messages.notFound(collectionKey.expense));
    }
    return expense;
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.update(collectionKey.expense) })
  @ApiOkResponse({ description: responseMessage.success, type: IReturnExpense })
  @ApiNotFoundResponse({
    description: responseMessage.notFound,
    type: ExceptionDto,
  })
  @ApiBadRequestResponse({
    description: responseMessage.badRequest,
    type: ExceptionDto,
  })
  @ApiBody({ type: IUpdateExpense })
  async updateExpense(
    @Param('id', new ZodValidationPipe(idSchema)) id: number,
    @Body(new ZodValidationPipe(updateExpenseSchema)) body: UpdateExpenseDto,
  ): Promise<IReturnExpense> {
    const expense = await this.expensesService.updateOneById(id, body);
    if (!expense) {
      throw new NotFoundException(messages.notFound(collectionKey.expense));
    }
    return expense;
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.delete(collectionKey.expense) })
  @ApiOkResponse({ description: responseMessage.success })
  @ApiNotFoundResponse({
    description: responseMessage.notFound,
    type: ExceptionDto,
  })
  async deleteExpense(
    @Param('id', new ZodValidationPipe(idSchema)) id: number,
  ): Promise<boolean> {
    const expense = await this.expensesService.findOneById(id);
    if (!expense) {
      throw new NotFoundException(messages.notFound(collectionKey.expense));
    }
    await this.expensesService.deleteOneById(id);
    return true;
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.getMany(collectionKey.expense) })
  @ApiOkResponse({
    description: responseMessage.success,
    type: [IReturnExpense],
  })
  @ApiNotFoundResponse({
    description: responseMessage.notFound,
    type: ExceptionDto,
  })
  async getExpensesByUserId(@Req() req: Request): Promise<IReturnExpense[]> {
    const user = await this.usersService.findOneById(req.user['id']);
    if (!user) {
      throw new NotFoundException(messages.notFound(collectionKey.user));
    }
    return await this.expensesService.findManyByCategoryId(req.user['id']);
  }

  @Delete()
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.deleteMany(collectionKey.expense) })
  @ApiOkResponse({ description: responseMessage.success })
  @ApiNotFoundResponse({
    description: responseMessage.notFound,
    type: ExceptionDto,
  })
  @ApiBadRequestResponse({
    description: responseMessage.badRequest,
    type: ExceptionDto,
  })
  async deleteAllExpensesByUserId(
    @Query('categoryId', new ZodValidationPipe(idSchema)) categoryId: number,
  ): Promise<boolean> {
    const category = await this.categoriesService.findOneById(categoryId);
    if (!category) {
      throw new NotFoundException(messages.notFound(collectionKey.category));
    }
    await this.expensesService.deleteAllCategoryExpenses(categoryId);
    return true;
  }
}
