import { 
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  NotFoundException,
  UsePipes,
  Body,
  InternalServerErrorException,
  Query
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
  responseMessage,
  messages,
  summaries
} from 'src/common/text/messages';
import { collectionKey } from 'src/common/text/keywords';
import { nameSchema } from 'src/common/dto/name.dto';

import { 
  CreateUserDto,
  createUserSchema,
  UpdateUserDto,
  updateUserSchema
} from './dto';
import { 
  ICreateUser,
  IReturnUser,
  IUpdateUser
} from './interfaces';

import { UsersService } from './users.service';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({
    summary: summaries.getOne(collectionKey.user),
  })
  @ApiOkResponse({ description: responseMessage.success, type: IReturnUser })
  @ApiNotFoundResponse({
    description: responseMessage.notFound,
    type: ExceptionDto,
  })
  async getUserById(
    @Param('id', new ZodValidationPipe(idSchema)) id: number,
  ): Promise<IReturnUser> {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException(messages.notFound(collectionKey.user));
    }
    return user;
  }

  @Get()
  @ApiOperation({
    summary: summaries.getMany(collectionKey.user),
  })
  async getManyUsersBySearchString(
    @Query('searchString', new ZodValidationPipe(nameSchema)) searchString: string
  ): Promise<IReturnUser[]> {
    const users = await this.usersService.findManyUsersBySearchString(searchString);
    return users;
  }

  @Post()
  @ApiOperation({
    summary: summaries.create(collectionKey.user),
  })
  @ApiBody({ type: ICreateUser })
  @ApiOkResponse({ description: responseMessage.success, type: Boolean })
  @ApiBadRequestResponse({
    description: responseMessage.badRequest,
    type: ExceptionDto,
  })
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async createUser(@Body() body: CreateUserDto): Promise<Boolean> {
    const user = await this.usersService.createOne(body);
    if (!user) {
      throw new InternalServerErrorException(responseMessage.internalServerError);
    }
    return true;
  }

  @Patch(':id')
  @ApiOperation({
    summary: summaries.update(collectionKey.user),
  })
  @ApiBody({ type: IUpdateUser })
  @ApiOkResponse({ description: responseMessage.success, type: IReturnUser })
  @ApiNotFoundResponse({
    description: responseMessage.notFound,
    type: ExceptionDto,
  })
  async updateUser(
    @Param('id', new ZodValidationPipe(idSchema)) id: number,
    @Body(new ZodValidationPipe(updateUserSchema)) body: UpdateUserDto
  ): Promise<IReturnUser> {
    const user = this.usersService.updateOneById(id, body);
    if (!user) {
      throw new NotFoundException(messages.notFound(collectionKey.user));
    }
    return user;
  }

  @Delete(':id')
  @ApiOperation({
    summary: summaries.delete(collectionKey.user),
  })
  @ApiOkResponse({ description: responseMessage.success, type: Boolean })
  @ApiNotFoundResponse({
    description: responseMessage.notFound,
    type: ExceptionDto,
  })
  async deleteUser(
    @Param('id', new ZodValidationPipe(idSchema)) id: number,
  ): Promise<Boolean> {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException(messages.notFound(collectionKey.user));
    }
    await this.usersService.deleteOneById(id);
    return true;
  }
}
