import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';

import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';

import config from './config/app.config';
import { DatabaseModule } from './config/db.config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AppExceptionsFilter } from './filters/exceptions.filter';
import { PostInterceptor } from './interceptors/post.interceptor';

import { CloudStorageModule } from './modules/cloud-storage/cloud-storage.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { FinancialTipsModule } from './modules/financial-tips/financial-tips.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SchedulerService } from './modules/scheduler/scheduler.service';
import { JwtStrategy } from './guards/strategies/jwt.strategy';
import { ExportedDataFileModule } from './modules/exported-data-file/exported-data-file.module';
import { ReceiptModule } from './modules/receipt/receipt.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    ScheduleModule.forRoot(),
    HttpModule,
    DatabaseModule,
    CloudStorageModule,
    UsersModule,
    CategoriesModule,
    ExpensesModule,
    AuthModule,
    FinancialTipsModule,
    ExportedDataFileModule,
    ReceiptModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // {
    //   provide: APP_FILTER,
    //   useClass: SentryGlobalFilter,
    // },
    {
      provide: APP_FILTER,
      useClass: AppExceptionsFilter,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: TransformInterceptor,
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: PostInterceptor,
    },
    SchedulerService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
