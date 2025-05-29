import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { MulterConfigService } from 'src/config/multer.config';
import { CloudStorageModule } from '../cloud-storage/cloud-storage.module';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MulterModule.register(
      new MulterConfigService('avatars', true).createMulterOptions(),
    ),
    CloudStorageModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
