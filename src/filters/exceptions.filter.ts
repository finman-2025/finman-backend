import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { SentryExceptionCaptured } from '@sentry/nestjs';

import { ExceptionDto } from 'src/common/dto';
import { responseMessage } from 'src/common/text';

@Catch()
export class AppExceptionsFilter implements ExceptionFilter {
  @SentryExceptionCaptured()
  catch(exception: any, host: ArgumentsHost): void {
    console.error('Exception caught by AppExceptionsFilter:', exception);
    const ctx = host.switchToHttp();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody: ExceptionDto = {
      statusCode: httpStatus,
      message:
        exception?.response?.message ?? responseMessage.internalServerError,
    };

    ctx.getResponse().status(httpStatus).json(responseBody);
  }
}
