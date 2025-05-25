import { Module } from '@nestjs/common';
import { FinancialTipsController } from './financial-tips.controller';
import { FinancialTipsService } from './financial-tips.service';

@Module({
  controllers: [FinancialTipsController],
  providers: [FinancialTipsService],
  exports: [FinancialTipsService],
})
export class FinancialTipsModule {}
