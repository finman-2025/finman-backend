import { Controller } from '@nestjs/common';
import { FinancialTipService } from './financial-tip.service';

@Controller('financial-tips')
export class FinancialTipController {
  constructor(private readonly FinancialTipService) {}
}
