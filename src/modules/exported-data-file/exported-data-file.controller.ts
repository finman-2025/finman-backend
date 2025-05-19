import { Controller, Delete, Get, Param, Post, Req, UploadedFile } from "@nestjs/common";
import { ExportedDataFileService } from "./exported-data-file.service";
import { Request } from "express";

@Controller('exported_data_file')
export class ExportedDataFileController {
    constructor(
        private readonly exportedDataFileService: ExportedDataFileService,
    ) {}
    
    @Post()
    async uploadFile(
        @Req() req: Request,
        @UploadedFile() file: Express.Multer.File
    ) {
        const fileName = `${Date.now()}-${file.originalname}`;
        const fileUrl = await this.exportedDataFileService.uploadFile(
            file,
            req.user['id'],
            fileName,
            "csv"
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