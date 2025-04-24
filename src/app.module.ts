import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

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

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    DatabaseModule,
    UsersModule,
    CategoriesModule,
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
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
