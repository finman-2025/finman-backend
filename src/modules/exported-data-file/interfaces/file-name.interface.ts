import { PickType } from '@nestjs/swagger';
import { IExportedDataFile } from './exported-data-file.interface';

export class IFileName extends PickType(IExportedDataFile, ['fileName']) {}
