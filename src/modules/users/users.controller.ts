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
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { idSchema, ExceptionDto } from 'src/common/dto';
import { responseMessage, messages, summaries } from 'src/common/text/messages';
import { collectionKey, fieldKey } from 'src/common/text/keywords';
import { nameSchema } from 'src/common/dto/name.dto';

import { UpdateUserDto, updateUserSchema } from './dto';
import { IReturnUser, IUpdateUser } from './interfaces';

import { UsersService } from './users.service';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.getOne(collectionKey.user) })
  @ApiOkResponse({ description: responseMessage.success, type: IReturnUser })
  @ApiNotFoundResponse({
    description: responseMessage.notFound(collectionKey.user),
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
  async getManyUsersBySearchString(
    @Query('searchString', new ZodValidationPipe(nameSchema))
    searchString: string,
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
  @ApiOkResponse({ description: responseMessage.success, type: IReturnUser })
  @ApiNotFoundResponse({
    description: responseMessage.notFound(collectionKey.user),
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
    await this.usersService.updateOneById(id, body);
    return user;
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.delete(collectionKey.user) })
  @ApiOkResponse({ description: responseMessage.success, type: Boolean })
  @ApiNotFoundResponse({
    description: responseMessage.notFound(collectionKey.user),
    type: ExceptionDto,
  })
  async deleteUser(
    @Param('id', new ZodValidationPipe(idSchema)) id: number,
  ): Promise<boolean> {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException(messages.notFound(collectionKey.user));
    }
    await this.usersService.deleteOneById(id);
    return true;
  }
}
