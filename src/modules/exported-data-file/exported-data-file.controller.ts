import { Controller, Delete, Get, Param, Post, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";

import { Request } from "express";

import { ExportedDataFileService } from "./exported-data-file.service";

@Controller('exported_data_file')
export class ExportedDataFileController {
    constructor(
        private readonly exportedDataFileService: ExportedDataFileService,
    ) {}
    
    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Receipt image (JPEG or PNG, max 5MB)',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @Req() req: Request,
        @UploadedFile() file: Express.Multer.File
    ) {
        const fileName = `${Date.now()}-${file.originalname}`;
        const fileUrl = await this.exportedDataFileService.uploadFile(
            file,
            req.user['id'],
            fileName
        );
        return { url: fileUrl };
    }

    @Get(':fileName')
    async getFile(
        @Req() req: Request,
        @Param() fileName: string 
    ) {
        const stream = await this.exportedDataFileService.fetchUserExportedFile(
            req.user['id'],
            fileName
        );
        return stream;
    }

    @Delete(':fileName')
    async deleteFile(
        @Req() req: Request,
        @Param() fileName: string
    ) {
        const filePath = this.exportedDataFileService.getFileUrl(fileName);
        const result = await this.exportedDataFileService.deleteFile(filePath);
    }
}