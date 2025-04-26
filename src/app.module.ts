import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';

import config from './config/app.config';
import { DatabaseModule } from './config/db.config';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AppExceptionsFilter } from './filters/exceptions.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { PostInterceptor } from './interceptors/post.interceptor';

import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SchedulerService } from './modules/scheduler/scheduler.service';
import { ExpensesModule } from './modules/expenses/expenses.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    ScheduleModule.forRoot(),
    HttpModule,
    DatabaseModule,
    UsersModule,
    CategoriesModule,
    ExpensesModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AppExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
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
