import {
  Controller,
  Get,
  Post,
  UsePipes,
  Body,
  Param,
  NotFoundException,
  InternalServerErrorException,
  Patch,
  Delete,
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
import { Request } from 'express';

import { idSchema, ExceptionDto } from 'src/common/dto';
import {
  CreateCategoryDto,
  createCategorySchema,
  UpdateCategoryDto,
  updateCategorySchema,
} from './dto';
import { ICategory, ICreateCategory, IUpdateCategory } from './interfaces';

import { CategoriesService } from './categories.service';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';

import {
  responseMessage,
  messages,
  summaries,
  collectionKey,
} from 'src/common/text';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.getList(collectionKey.category) })
  @ApiOkResponse({ description: responseMessage.success, type: ICategory })
  @ApiBadRequestResponse({
    description: responseMessage.badRequest,
    type: ExceptionDto,
  })
  async getCategoryByUser(@Req() req: Request): Promise<ICategory[]> {
    const categories = await this.categoriesService.findAll(req.user['id']);
    if (!categories) {
      throw new NotFoundException(messages.notFound(collectionKey.user));
    }
    return categories;
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.getOne(collectionKey.category) })
  @ApiOkResponse({ description: responseMessage.success, type: ICategory })
  @ApiNotFoundResponse({
    description: responseMessage.notFound,
    type: ExceptionDto,
  })
  async getCategoryById(
    @Param('id', new ZodValidationPipe(idSchema)) id: number,
  ): Promise<ICategory> {
    const category = await this.categoriesService.findOneById(id);
    if (!category) {
      throw new NotFoundException(messages.notFound(collectionKey.category));
    }
    return category;
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.create(collectionKey.category) })
  @ApiOkResponse({ description: responseMessage.success, type: ICategory })
  @ApiBadRequestResponse({
    description: responseMessage.badRequest,
    type: ExceptionDto,
  })
  @ApiBody({ type: ICreateCategory })
  @UsePipes(new ZodValidationPipe(createCategorySchema))
  async createCategory(
    @Req() req: Request,
    @Body() body: CreateCategoryDto,
  ): Promise<ICategory> {
    const category = await this.categoriesService.create(body, req.user['id']);
    if (!category) {
      throw new InternalServerErrorException(
        responseMessage.internalServerError,
      );
    }
    return category;
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.update(collectionKey.category) })
  @ApiBody({ type: IUpdateCategory })
  @ApiOkResponse({ description: responseMessage.success, type: ICategory })
  @ApiNotFoundResponse({
    description: responseMessage.notFound,
    type: ExceptionDto,
  })
  @ApiBadRequestResponse({
    description: responseMessage.badRequest,
    type: ExceptionDto,
  })
  async updateCategory(
    @Param('id', new ZodValidationPipe(idSchema)) id: number,
    @Body(new ZodValidationPipe(updateCategorySchema)) body: UpdateCategoryDto,
  ): Promise<ICategory> {
    const category = await this.categoriesService.update(id, body);
    if (!category) {
      throw new NotFoundException(messages.notFound(collectionKey.category));
    }
    return category;
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.delete(collectionKey.category) })
  @ApiOkResponse({ description: responseMessage.success, type: Boolean })
  @ApiNotFoundResponse({
    description: responseMessage.notFound,
    type: ExceptionDto,
  })
  async deleteCategory(
    @Param('id', new ZodValidationPipe(idSchema)) id: number,
  ): Promise<boolean> {
    const category = await this.categoriesService.findOneById(id);
    if (!category) {
      throw new NotFoundException(messages.notFound(collectionKey.category));
    }
    await this.categoriesService.delete(id);
    return true;
  }
}
