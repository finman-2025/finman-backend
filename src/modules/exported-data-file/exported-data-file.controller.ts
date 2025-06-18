import {
    Controller,
    Get,
    Post,
    Delete,
    Req,
    Param,
    Body,
    UsePipes,
    NotFoundException,
} from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
} from "@nestjs/swagger";

import { Request } from "express";

import {
    collectionKey,
    fieldKey,
    responseMessage,
    summaries
} from "src/common/text";
import { ExceptionDto, IResponseMessage } from "src/common/dto";

import { string } from "zod";
import { ZodValidationPipe } from "src/pipes/validation.pipe";

import { ExportExpensesDto, exportExpensesSchema, ReturnFileDto } from "./dto";
import { IExportExpenses, IReturnFile } from "./interfaces";

import { ExportedDataFileService } from "./exported-data-file.service";

@Controller('exported_data_file')
export class ExportedDataFileController {
    constructor(
        private readonly exportedDataFileService: ExportedDataFileService,
    ) {}

    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: summaries.getMany(collectionKey.exportedDataFile) })
    @ApiOkResponse({
        description: responseMessage.success,
        type: [IReturnFile],
    })
    @ApiNotFoundResponse({
        description: responseMessage.notFound(collectionKey.exportedDataFile),
        type: ExceptionDto,
    })
    async getAllFiles(
        @Req() req: Request
    ): Promise<ReturnFileDto[]> {
        const files = await this.exportedDataFileService.listUserExportedFiles(req.user['id']);
        if (!files || files.length === 0)
            throw new NotFoundException(responseMessage.notFound(collectionKey.exportedDataFile));

        return files;
    }

    @Delete(':fileName')
    @ApiBearerAuth()
    @ApiOperation({ summary: summaries.delete(collectionKey.exportedDataFile) })
    @ApiOkResponse({
        description: responseMessage.success,
        type: IResponseMessage,
    })
    @ApiBadRequestResponse({
        description: responseMessage.badRequest(fieldKey.fileName),
        type: ExceptionDto,
    })
    @ApiNotFoundResponse({
        description: responseMessage.notFound(collectionKey.exportedDataFile),
        type: ExceptionDto,
    })
    @ApiParam({ name: 'fileName', type: string, description: 'Name of the file to delete' })
    async deleteFile(
        @Req() req: Request,
        @Param() fileName: string
    ) {
        await this.exportedDataFileService.deleteFile(
            req.user['id'],
            fileName
        );
        return { messages: responseMessage.success };
    }

    @Post('export_expenses')
    @ApiBearerAuth()
    @ApiOperation({ summary: summaries.exportExpenses() })
    @ApiOkResponse({
        description: responseMessage.success,
        type: IReturnFile,
    })
    @ApiBadRequestResponse({
        description: responseMessage.badRequest(fieldKey.fileType),
        type: ExceptionDto,
    })
    @ApiBody({ type: IExportExpenses })
    @UsePipes(new ZodValidationPipe(exportExpensesSchema))
    async export_expenses(
        @Req() req: Request,
        @Body() body: ExportExpensesDto
    ): Promise<ReturnFileDto> {
        return await this.exportedDataFileService.exportExpensesToFile(
            req.user['id'],
            body.startDate ? new Date(body.startDate) : undefined,
            body.endDate ? new Date(body.endDate) : undefined,
            body.fileType || 'csv'
        );
    }
}