import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { BillomathdrService } from './billomathdr.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('billomathdr')
export class BillomathdrController {
  constructor(private readonly billomathdr: BillomathdrService) {}
  @UseGuards(AuthGuard)
  @Get('bystockcode/:stockcode')
  getByStockcode(@Param('stockcode') stockcode: string) {
    return this.billomathdr.getByStockcode(stockcode);
  }
}
