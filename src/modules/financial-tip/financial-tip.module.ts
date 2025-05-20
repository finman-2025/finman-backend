import { Module } from '@nestjs/common';
import { FinancialTipController } from './financial-tip.controller';
import { FinancialTipService } from './financial-tip.service';

@Module({
    controllers: [FinancialTipController],
    providers: [FinancialTipService],
    exports: [FinancialTipService]
})
export class FinancialTipModule {}
