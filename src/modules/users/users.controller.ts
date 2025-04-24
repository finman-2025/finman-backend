import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { idSchema, ExceptionDto } from 'src/common/dto';
import { loginSchema, UserDto } from './dto';

import { UsersService } from './users.service';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';

import { responseMessage, messages, summaries } from 'src/common/text/messages';
import { collectionKey } from 'src/common/text/keywords';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // @ApiOperation({
  //   summary: 'test',
  // })
  // @ApiOkResponse({ type: UserDto })
  // @ApiBadRequestResponse({
  //   description: 'Bad request',
  //   type: ExceptionDto,
  // })
  // @UsePipes(new ZodValidationPipe(loginSchema))
  // async getUserByUsernameAndPassword(@Body() body: any): Promise<UserDto> {
  //   const user = await this.userService.findOneByUsernameAndPassword(
  //     body.username,
  //     body.password,
  //   );
  //   if (!user) {
  //     throw new UnauthorizedException(responseMessage.wrongUsernameOrPassword);
  //   }
  //   return user;
  // }

  @Get(':id')
  @ApiOperation({
    summary: summaries.getOne(collectionKey.user),
  })
  @ApiOkResponse({ description: responseMessage.success, type: UserDto })
  @ApiNotFoundResponse({
    description: responseMessage.notFound,
    type: ExceptionDto,
  })
  async getUserById(
    @Param('id', new ZodValidationPipe(idSchema)) id: number,
  ): Promise<UserDto> {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException(messages.notFound(collectionKey.user));
    }
    return user;
  }
}
