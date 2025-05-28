import {
    Controller,
    Get,
    Post,
    Delete,
    Req,
    Param,
    Body,
    BadRequestException,
    UploadedFile,
    UseInterceptors,
    UsePipes,
    NotFoundException,
} from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { ReadableStream } from "node:stream/web";

import { Request } from "express";

import { ExportedDataFileService } from "./exported-data-file.service";
import { IFileName, IExportExpenses } from "./interfaces";
import { collectionKey, fieldKey, responseMessage, summaries } from "src/common/text";
import { ExceptionDto, IResponseMessage } from "src/common/dto";
import { ExportExpensesDto, exportExpensesSchema, FileNameDto, fileNameSchema } from "./dto";
import { ZodValidationPipe } from "src/pipes/validation.pipe";

@Controller('exported_data_file')
export class ExportedDataFileController {
    constructor(
        private readonly exportedDataFileService: ExportedDataFileService,
    ) {}
    
    @Post()
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Upload a file (TXT, PDF, CSV, XLS, XLSX, max 5MB)',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @Req() req: Request,
        @UploadedFile() file: Express.Multer.File
    ) {
        console.log('File uploaded:', file);
        if (!file)
            throw new BadRequestException(responseMessage.badRequest(fieldKey.file));

        const fileName = `${Date.now()}-${file.originalname}`;
        const fileUrl = await this.exportedDataFileService.uploadFile(
            req.user['id'],
            file.path,
            fileName,
            file.mimetype,
        );
        return { url: fileUrl };
    }

    @Get(':fileName')
    @ApiBearerAuth()
    @ApiOperation({ summary: summaries.getOne(collectionKey.exportedDataFile) })
    @ApiOkResponse({
        description: responseMessage.success,
        type: ReadableStream,
    })
    @ApiNotFoundResponse({
        description: responseMessage.notFound(collectionKey.exportedDataFile),
        type: ExceptionDto,
    })
    @ApiBadRequestResponse({
        description: responseMessage.badRequest(fieldKey.fileName),
        type: ExceptionDto,
    })
    @ApiParam({ name: 'fileName', type: IFileName, description: 'Name of the file to retrieve' })
    @UsePipes(new ZodValidationPipe(fileNameSchema))
    async getFile(
        @Req() req: Request,
        @Param('fileName') param: FileNameDto
    ) {
        const stream = await this.exportedDataFileService.fetchUserExportedFile(
            req.user['id'],
            param.fileName
        );
        return stream;
    }

    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: summaries.getMany(collectionKey.exportedDataFile) })
    @ApiOkResponse({
        description: responseMessage.success,
        type: [IFileName],
    })
    @ApiNotFoundResponse({
        description: responseMessage.notFound(collectionKey.exportedDataFile),
        type: ExceptionDto,
    })
    async getAllFiles(
        @Req() req: Request
    ): Promise<IFileName[]> {
        const files = await this.exportedDataFileService.listUserExportedFiles(req.user['id']);
        if (!files || files.length === 0)
            throw new NotFoundException(responseMessage.notFound(collectionKey.exportedDataFile));

        return files.map(file => ({ fileName: file.fileName }));
    }

    @Delete()
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
    @ApiBody({ type: IFileName })
    @UsePipes(new ZodValidationPipe(fileNameSchema))
    async deleteFile(
        @Req() req: Request,
        @Body() body: IFileName
    ) {
        await this.exportedDataFileService.deleteFile(
            req.user['id'],
            body.fileName
        );
        return { messages: responseMessage.success };
    }

    @Post('export_expenses')
    @ApiBearerAuth()
    @ApiOperation({ summary: summaries.exportExpenses() })
    @ApiOkResponse({
        description: responseMessage.success,
        type: IFileName,
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
    ): Promise<IFileName> {
        const fileName = await this.exportedDataFileService.exportExpensesToFile(
            req.user['id'],
            body.startDate ? new Date(body.startDate) : undefined,
            body.endDate ? new Date(body.endDate) : undefined,
            body.fileType || 'csv'
        );

        if (fileName)
            return { fileName: fileName };
    }
}