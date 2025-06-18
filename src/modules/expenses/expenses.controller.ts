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
  ApiQuery,
} from '@nestjs/swagger';

import { Request } from 'express';

import {
  collectionKey,
  messages,
  responseMessage,
  summaries,
} from 'src/common/text';
import {
  ExceptionDto,
  idSchema,
  IResponseMessage,
  optionalDateSchema,
  optionalIdSchema,
} from 'src/common/dto';

import { ZodValidationPipe } from 'src/pipes/validation.pipe';

import {
  createExpenseSchema,
  updateExpenseSchema,
  getExpenseValueSchema,
  CreateExpenseDto,
  GetExpenseValueDto,
  UpdateExpenseDto,
} from './dto';
import {
  ICreateExpense,
  IReturnExpense,
  ITotalExpenseValue,
  IUpdateExpense,
} from './interfaces';

import { ExpensesService } from './expenses.service';
import { CategoriesService } from 'src/modules/categories/categories.service';

@Controller('expenses')
export class ExpensesController {
  constructor(
    private readonly expensesService: ExpensesService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.getMany(collectionKey.expense) })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    description: 'yyyy-mm-dd',
  })
  @ApiOkResponse({
    description: responseMessage.success,
    type: [IReturnExpense],
  })
  @ApiNotFoundResponse({
    description: responseMessage.notFound(collectionKey.expense),
    type: ExceptionDto,
  })
  async getExpenses(
    @Req() req: Request,
    @Query('categoryId', new ZodValidationPipe(optionalIdSchema))
    categoryId?: number,
    @Query('date', new ZodValidationPipe(optionalDateSchema))
    date?: Date,
  ): Promise<IReturnExpense[]> {
    if (categoryId) {
      const category = await this.categoriesService.findOneById(categoryId);
      if (!category)
        throw new NotFoundException(messages.notFound(collectionKey.category));
    }

    return await this.expensesService.findMany(
      req.user['id'],
      categoryId,
      date,
    );
  }

  @Get('total')
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.getTotal(collectionKey.expense) })
  @ApiQuery({
    name: 'startDate',
    type: String,
    description: 'yyyy-mm-dd',
  })
  @ApiQuery({
    name: 'endDate',
    type: String,
    description: 'yyyy-mm-dd',
  })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiOkResponse({
    description: responseMessage.success,
    type: ITotalExpenseValue,
  })
  @ApiNotFoundResponse({
    description: responseMessage.notFound(collectionKey.expense),
    type: ExceptionDto,
  })
  async getTotalExpenseValue(
    @Req() req: Request,
    @Query(new ZodValidationPipe(getExpenseValueSchema))
    query: GetExpenseValueDto,
  ): Promise<ITotalExpenseValue> {
    const { startDate, endDate, categoryId } = query;

    if (categoryId) {
      const category = await this.categoriesService.findOneById(categoryId);
      if (!category)
        throw new NotFoundException(messages.notFound(collectionKey.category));
    }

    return await this.expensesService.getTotalExpenseValue(
      req.user['id'],
      categoryId,
      startDate,
      endDate,
    );
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.getOne(collectionKey.expense) })
  @ApiOkResponse({
    description: responseMessage.success,
    type: IReturnExpense,
  })
  @ApiNotFoundResponse({
    description: responseMessage.notFound(collectionKey.expense),
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
  @ApiOkResponse({
    description: responseMessage.success,
    type: IReturnExpense,
  })
  @ApiBadRequestResponse({
    description: responseMessage.badRequest(),
    type: ExceptionDto,
  })
  @ApiBody({ type: ICreateExpense })
  async createExpense(
    @Req() req: Request,
    @Body(new ZodValidationPipe(createExpenseSchema)) body: CreateExpenseDto,
  ): Promise<IReturnExpense | { message: string }> {
    body.userId = req.user['id'];
    const expense = await this.expensesService.createOne(body);
    return expense;
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.update(collectionKey.expense) })
  @ApiOkResponse({
    description: responseMessage.success,
    type: IReturnExpense,
  })
  @ApiNotFoundResponse({
    description: responseMessage.notFound(collectionKey.expense),
    type: ExceptionDto,
  })
  @ApiBadRequestResponse({
    description: responseMessage.badRequest(),
    type: ExceptionDto,
  })
  @ApiBody({ type: IUpdateExpense })
  async updateExpense(
    @Param('id', new ZodValidationPipe(idSchema)) id: number,
    @Body(new ZodValidationPipe(updateExpenseSchema)) body: UpdateExpenseDto,
  ): Promise<IReturnExpense> {
    return await this.expensesService.updateOneById(id, body);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.delete(collectionKey.expense) })
  @ApiOkResponse({ description: responseMessage.success })
  @ApiNotFoundResponse({
    description: responseMessage.notFound(collectionKey.expense),
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

  @Delete()
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.deleteMany(collectionKey.expense) })
  @ApiOkResponse({
    description: responseMessage.success,
    type: IResponseMessage,
  })
  @ApiNotFoundResponse({
    description: responseMessage.notFound(collectionKey.category),
    type: ExceptionDto,
  })
  @ApiBadRequestResponse({
    description: responseMessage.badRequest(),
    type: ExceptionDto,
  })
  async deleteAllExpensesByUserId(
    @Query('categoryId', new ZodValidationPipe(idSchema)) categoryId: number,
  ): Promise<IResponseMessage> {
    const category = await this.categoriesService.findOneById(categoryId);
    if (!category) {
      throw new NotFoundException(messages.notFound(collectionKey.category));
    }
    await this.expensesService.deleteAllCategoryExpenses(categoryId);
    return { message: responseMessage.success };
  }
}
