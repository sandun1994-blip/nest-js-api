import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { BillomatlinesService } from './billomatlines.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('billomatlines')
export class BillomatlinesController {
  constructor(private readonly billomatlinesService: BillomatlinesService) {}

  @UseGuards(AuthGuard)
  @Get('bystockcode/:stockcode')
  getByStockcode(@Param('stockcode') stockcode: string) {
    return this.billomatlinesService.getByStockcode(stockcode);
  }
}
