import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  NotFoundException,
  Body,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { responseMessage, messages, summaries } from 'src/common/text/messages';
import { collectionKey, fieldKey } from 'src/common/text/keywords';
import { idSchema, ExceptionDto, IResponseMessage } from 'src/common/dto';
import { nameSchema } from 'src/common/dto/name.dto';

import { ZodValidationPipe } from 'src/pipes/validation.pipe';

import { UpdateUserDto, updateUserSchema } from './dto';
import { IReturnUser, IUpdateUser } from './interfaces';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.getOne(collectionKey.user) })
  @ApiOkResponse({
    description: responseMessage.success,
    type: IReturnUser
  })
  @ApiNotFoundResponse({
    description: responseMessage.notFound(collectionKey.user),
    type: ExceptionDto,
  })
  @ApiBadRequestResponse({
    description: responseMessage.badRequest(fieldKey.id),
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
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.getMany(collectionKey.user) })
  @ApiOkResponse({
    description: responseMessage.success,
    type: [IReturnUser]
  })
  @ApiNotFoundResponse({
    description: responseMessage.notFound(collectionKey.user),
    type: ExceptionDto,
  })
  async getManyUsersBySearchString(
    @Query('searchString', new ZodValidationPipe(nameSchema)) searchString: string,
  ): Promise<IReturnUser[]> {
    const users =
      await this.usersService.findManyUsersBySearchString(searchString);
    return users;
  }

  // @Post()
  // @ApiOperation({
  //   summary: summaries.create(collectionKey.user),
  // })
  // @ApiBody({ type: ICreateUser })
  // @ApiOkResponse({ description: responseMessage.success, type: Boolean })
  // @ApiBadRequestResponse({
  //   description: responseMessage.badRequest,
  //   type: ExceptionDto,
  // })
  // @UsePipes(new ZodValidationPipe(createUserSchema))
  // async createUser(@Body() body: CreateUserDto): Promise<Boolean> {
  //   await this.usersService.createOne(body);
  //   return true;
  // }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.update(collectionKey.user) })
  @ApiOkResponse({
    description: responseMessage.success,
    type: IReturnUser
  })
  @ApiNotFoundResponse({
    description: responseMessage.notFound(collectionKey.user),
    type: ExceptionDto,
  })
  @ApiBadRequestResponse({
    description: responseMessage.badRequest(fieldKey.id),
    type: ExceptionDto,
  })
  @ApiBody({ type: IUpdateUser })
  async updateUser(
    @Param('id', new ZodValidationPipe(idSchema)) id: number,
    @Body(new ZodValidationPipe(updateUserSchema)) body: UpdateUserDto,
  ): Promise<IReturnUser> {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException(messages.notFound(collectionKey.user));
    }
    return await this.usersService.updateOneById(id, body);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.delete(collectionKey.user) })
  @ApiOkResponse({
    description: responseMessage.success,
    type: IResponseMessage
  })
  @ApiNotFoundResponse({
    description: responseMessage.notFound(collectionKey.user),
    type: ExceptionDto,
  })
  @ApiBadRequestResponse({
    description: responseMessage.badRequest(fieldKey.id),
    type: ExceptionDto,
  })
  async deleteUser(
    @Param('id', new ZodValidationPipe(idSchema)) id: number,
  ): Promise<IResponseMessage> {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException(messages.notFound(collectionKey.user));
    }
    await this.usersService.deleteOneById(id);
    return { message: responseMessage.success };
  }
}
