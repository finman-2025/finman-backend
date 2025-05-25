import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Post, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";

import { Request } from "express";

import { ExportedDataFileService } from "./exported-data-file.service";
import { IFileName } from "./interfaces";
import { responseMessage } from "src/common/text";

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
        if (!file) {
            throw new InternalServerErrorException('No file uploaded or file is invalid');
        }
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
    @ApiParam({ name: 'fileName', type: String, description: 'Name of the file to retrieve' })
    async getFile(
        @Req() req: Request,
        @Param() param: { fileName: string } 
    ) {
        const stream = await this.exportedDataFileService.fetchUserExportedFile(
            req.user['id'],
            param.fileName
        );
        return stream;
    }

    @Delete(':fileName')
    @ApiBearerAuth()
    @ApiBody({ type: IFileName })
    async deleteFile(
        @Req() req: Request,
        @Body() body: IFileName
    ) {
        const filePath = this.exportedDataFileService.getFileUrl(req.user['id'], body.fileName);
        await this.exportedDataFileService.deleteFile(
            req.user['id'],
            body.fileName,
            filePath
        );
        return { messages: responseMessage.success };
    }
}