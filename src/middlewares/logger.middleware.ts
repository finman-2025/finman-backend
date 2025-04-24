import { HttpStatus, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { colors } from 'src/common/colors';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const startAt = process.hrtime();
    const { ip, method, originalUrl, body } = request;

    response.on('finish', () => {
      const { statusCode } = response;
      const diff = process.hrtime(startAt);
      const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;

      const listStatus = [
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpStatus.BAD_REQUEST,
      ];

      if (
        listStatus.includes(statusCode) &&
        body &&
        Object.keys(body).length !== 0
      ) {
        this.logger.log(
          `${colors.FgCyan}PAYLOAD ${colors.FgMagenta}${JSON.stringify(body)}`,
        );
      }

      const logStatusCode = `${
        statusCode === HttpStatus.OK
          ? colors.BgGreen
          : statusCode === HttpStatus.NOT_MODIFIED
            ? colors.BgYellow
            : colors.BgRed
      }${colors.FgWhite} ${statusCode} ${colors.Reset}`;

      const logMethod = `${
        method === 'GET'
          ? colors.FgBlue
          : method === 'POST'
            ? colors.FgGreen
            : method === 'DELETE'
              ? colors.FgRed
              : colors.FgYellow
      }${method}`.padEnd(11);

      this.logger.log(
        `${colors.FgGray}| ${logStatusCode} ${colors.FgGray}| ${logMethod} ${colors.FgWhite}${originalUrl.padEnd(30)} ${colors.FgGray}|\t ${
          colors.FgWhite
        }${ip} ${colors.FgYellow}+${responseTime.toFixed(0)}ms`,
      );
    });

    next();
  }
}
