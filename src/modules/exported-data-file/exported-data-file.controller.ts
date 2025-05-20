import { Controller } from "@nestjs/common";
import { ExportedDataFileService } from "./exported-data-file.service";

@Controller('exported_data_file')
export class ExportedDataFileController {
    constructor(
        private readonly exportedDataFileService: ExportedDataFileService,
    ) {}
    
}