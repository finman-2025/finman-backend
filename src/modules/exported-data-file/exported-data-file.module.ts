import { Module } from '@nestjs/common';
import { ExportedDataFileController } from './exported-data-file.controller';
import { ExportedDataFileService } from './exported-data-file.service';

@Module({
    controllers: [ExportedDataFileController],
    providers: [ExportedDataFileService],
    exports: [ExportedDataFileService]
})
export class ExportedDataFileModule {}
