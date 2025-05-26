import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { SkipJwtAuth } from 'src/annotations/skipAuth.annotation';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';

import { responseMessage, summaries } from 'src/common/text';
import { ExceptionDto } from 'src/common/dto';

import { IReturnReceiptData } from './interfaces';
import { uploadReceiptSchema } from './dto/upload-receipt.dto';

import { ReceiptService } from './receipt.service';

@Controller('receipts')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post('upload')
  @SkipJwtAuth()
  @ApiOperation({ summary: summaries.uploadReceipt() })
  @ApiOkResponse({
    description: responseMessage.success,
    type: IReturnReceiptData,
  })
  @ApiBadRequestResponse({
    description: responseMessage.badRequest(),
    type: ExceptionDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Receipt image (JPG or JPEG or PNG, max 5MB)',
        },
      },
    },
  })
  @UsePipes(new ZodValidationPipe(uploadReceiptSchema))
  @UseInterceptors(FileInterceptor('file'))
  async uploadReceipt(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IReturnReceiptData> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const receiptData = await this.receiptService.processReceipt(file.path);
    return receiptData;
  }
}
