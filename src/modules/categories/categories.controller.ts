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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { 
  idSchema,
  ExceptionDto
} from 'src/common/dto';
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
  @ApiOperation({ summary: summaries.getList(collectionKey.category) })
  @ApiOkResponse({ description: responseMessage.success, type: ICategory })
  @ApiBadRequestResponse({
    description: responseMessage.badRequest,
    type: ExceptionDto,
  })
  async getCategoryByUser(): Promise<ICategory[]> {
    const categories = await this.categoriesService.findAll(1);
    if (!categories) {
      throw new NotFoundException(messages.notFound(collectionKey.user));
    }
    return categories;
  }

  @Get(':id')
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
  @ApiOperation({ summary: summaries.create(collectionKey.category) })
  @ApiBody({ type: ICreateCategory })
  @ApiOkResponse({ description: responseMessage.success, type: ICategory })
  @ApiBadRequestResponse({
    description: responseMessage.badRequest,
    type: ExceptionDto,
  })
  @UsePipes(new ZodValidationPipe(createCategorySchema))
  async createCategory(@Body() body: CreateCategoryDto): Promise<ICategory> {
    const category = await this.categoriesService.create(body, 2);
    if (!category) {
      throw new InternalServerErrorException(
        responseMessage.internalServerError,
      );
    }
    return category;
  }

  @Patch(':id')
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
  @ApiOperation({ summary: summaries.delete(collectionKey.category) })
  @ApiOkResponse({ description: responseMessage.success, type: Boolean })
  @ApiNotFoundResponse({
    description: responseMessage.notFound,
    type: ExceptionDto,
  })
  async deleteCategory(
    @Param('id', new ZodValidationPipe(idSchema)) id: number,
  ): Promise<Boolean> {
    const category = await this.categoriesService.findOneById(id);
    if (!category) {
      throw new NotFoundException(messages.notFound(collectionKey.category));
    }
    await this.categoriesService.delete(id);
    return true;
  }
}
