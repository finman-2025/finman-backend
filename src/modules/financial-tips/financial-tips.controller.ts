import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';

import { collectionKey, messages } from 'src/common/text';

import { ICreateFinancialTip } from './interfaces';
import { CreateFinancialTipDto, createFinancialTipSchema } from './dto';
import { idSchema, optionalTypeSchema, typeSchema } from 'src/common/dto';

import { ZodValidationPipe } from 'src/pipes/validation.pipe';

import { FinancialTipsService } from './financial-tips.service';

@Controller('financial-tips')
export class FinancialTipsController {
  constructor(private readonly financialTipsService: FinancialTipsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: ICreateFinancialTip })
  async createFinancialTip(
    @Body(new ZodValidationPipe(createFinancialTipSchema))
    body: CreateFinancialTipDto,
  ) {
    const financialTip = await this.financialTipsService.createOne(body);
    if (!financialTip) {
      throw new ServiceUnavailableException(
        messages.unavailableService(collectionKey.tips),
      );
    }
    return financialTip;
  }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'type', required: false, type: String })
  async getAllFinancialTips(
    @Query('type', new ZodValidationPipe(optionalTypeSchema)) type?: string,
  ) {
    const financialTips = await this.financialTipsService.findAll(type);
    if (!financialTips) {
      throw new NotFoundException(messages.missing(collectionKey.tips));
    }
    return financialTips;
  }

  @Get(':id')
  @ApiBearerAuth()
  async getFinancialTipById(
    @Param('id', new ZodValidationPipe(idSchema)) id: number,
  ) {
    const financialTip = await this.financialTipsService.findOne(id);
    if (!financialTip) {
      throw new NotFoundException(messages.missing(collectionKey.tips));
    }
    return financialTip;
  }
}
