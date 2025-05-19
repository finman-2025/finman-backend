import { Body, Controller, Get, NotFoundException, Param, Post, ServiceUnavailableException } from "@nestjs/common";
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger";

import { collectionKey, messages } from "src/common/text";

import { ICreateFinancialTip } from "./interfaces";
import { CreateFinancialTipDto, createFinancialTipSchema } from "./dto";
import { idSchema, typeSchema } from "src/common/dto";

import { ZodValidationPipe } from "src/pipes/validation.pipe";

import { FinancialTipService } from "./financial-tip.service";

@Controller('financial_tip')
export class FinancialTipController {
    constructor(
        private readonly financialTipService: FinancialTipService,
    ) {}

    @Post()
    @ApiBearerAuth()
    @ApiBody({ type: ICreateFinancialTip })
    async createFinancialTip(
        @Body(new ZodValidationPipe(createFinancialTipSchema)) body: CreateFinancialTipDto
    ) {
        const financialTip = await this.financialTipService.createOne(body);
        if (!financialTip) {
            throw new ServiceUnavailableException(messages.unavailableService(collectionKey.tips));
        }
        return financialTip;
    }

    @Get('id')
    @ApiBearerAuth()
    async getFinancialTipById(
        @Param('id', new ZodValidationPipe(idSchema)) id: number,
    ) {
        const financialTip = await this.financialTipService.findOne(id);
        if (!financialTip) {
            throw new NotFoundException(messages.missing(collectionKey.tips));
        }
        return financialTip;
    }

    @Get(':type')
    @ApiBearerAuth()
    async getAllFinancialTipByType(
        @Param('type', new ZodValidationPipe(typeSchema)) type: string,
    ) {
        const financialTips = await this.financialTipService.findAllWithType(type);
        if (!financialTips) {
            throw new NotFoundException(messages.missing(collectionKey.tips));
        }
        return financialTips;
    }
}