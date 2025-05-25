import { Module } from '@nestjs/common';
import { ExportedDataFileController } from './exported-data-file.controller';
import { ExportedDataFileService } from './exported-data-file.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        MulterModule.register({
            dest: './uploads/exported_data_files',
            fileFilter: (req, file, cb) => {
                const allowedTypes = [
                    'text/plain',
                    'application/pdf',
                    'text/csv',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                ];
                if (allowedTypes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new Error('Only TXT, PDF, CSV, XLS, XLSX files are allowed!'), false);
                }
            },
            limits: { fileSize: 5 * 1024 * 1024 } // 5MB
        })
    ],
    controllers: [ExportedDataFileController],
    providers: [ExportedDataFileService],
    exports: [ExportedDataFileService]
})
export class ExportedDataFileModule {}
