import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExcenptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExcenptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    this.logger.error(
      `Request: ${request.method} ${request.url} - ${exception.message}`,
    );

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });

    if (process.env.NODE_ENV === 'development') {
      response.json({
        error: exception,
      });
    }
    return;
  }
}
