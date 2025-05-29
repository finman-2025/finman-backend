import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  NotFoundException,
  Body,
  Query,
  Req,
  Put,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { string } from 'zod';
import { Request } from 'express';

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

  @Put('avatar')
  @ApiBearerAuth()
  @ApiOperation({
    summary: summaries.update(collectionKey.user, fieldKey.avatar),
  })
  @ApiOkResponse({
    description: responseMessage.success,
    type: string,
  })
  @ApiBadRequestResponse({
    description: responseMessage.badRequest(fieldKey.file),
    type: ExceptionDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Upload a file (JPEG, PNG, max 5MB)',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string }> {
    if (!file)
      throw new BadRequestException(responseMessage.badRequest(fieldKey.file));

    const fileName = `${Date.now()}-${file.originalname}`;
    const url = await this.usersService.updateAvatar(
      req.user['id'],
      file.path,
      fileName,
      file.mimetype,
    );
    return { url };
  }

  @Delete('avatar')
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.delete(fieldKey.avatar) })
  @ApiOkResponse({
    description: responseMessage.success,
    type: IResponseMessage,
  })
  @ApiNotFoundResponse({
    description: responseMessage.notFound(fieldKey.avatar),
    type: ExceptionDto,
  })
  async deleteAvatar(@Req() req: Request): Promise<IResponseMessage> {
    await this.usersService.deleteAvatar(req.user['id']);
    return { message: responseMessage.success };
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.getMany(collectionKey.user) })
  @ApiOkResponse({
    description: responseMessage.success,
    type: [IReturnUser],
  })
  @ApiNotFoundResponse({
    description: responseMessage.notFound(collectionKey.user),
    type: ExceptionDto,
  })
  async getManyUsersBySearchString(
    @Query('searchString', new ZodValidationPipe(nameSchema))
    searchString: string,
  ): Promise<IReturnUser[]> {
    const users =
      await this.usersService.findManyUsersBySearchString(searchString);
    return users.map((user) => this.usersService.extractProfileData(user));
  }

  @Patch()
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.update(collectionKey.user) })
  @ApiOkResponse({
    description: responseMessage.success,
    type: IReturnUser,
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
  async updateCurrentUser(
    @Req() req: Request,
    @Body(new ZodValidationPipe(updateUserSchema)) body: UpdateUserDto,
  ): Promise<IReturnUser> {
    const user = await this.usersService.updateOneById(req.user['id'], body);
    return this.usersService.extractProfileData(user);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.getOne(collectionKey.user) })
  @ApiOkResponse({
    description: responseMessage.success,
    type: IReturnUser,
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
    if (!user)
      throw new NotFoundException(messages.notFound(collectionKey.user));

    return this.usersService.extractProfileData(user);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.update(collectionKey.user) })
  @ApiOkResponse({
    description: responseMessage.success,
    type: IReturnUser,
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
    const user = await this.usersService.updateOneById(id, body);
    return this.usersService.extractProfileData(user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: summaries.delete(collectionKey.user) })
  @ApiOkResponse({
    description: responseMessage.success,
    type: IResponseMessage,
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
    await this.usersService.deleteOneById(id);
    return { message: responseMessage.success };
  }
}
