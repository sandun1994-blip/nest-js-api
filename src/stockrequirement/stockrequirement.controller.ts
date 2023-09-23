import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { StockrequirementService } from './stockrequirement.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('stockrequirement')
export class StockrequirementController {
  constructor(
    private readonly stockrequirementService: StockrequirementService,
  ) {}
  @UseGuards(AuthGuard)
  @Get()
  getSTK(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: string,
  ) {
    // console.log(city, minPrice, maxPrice, propertyType, 'ok');
    return this.stockrequirementService.getStockrequirement();
  }

  @UseGuards(AuthGuard)
  @Get('stktwo/:stockcode')
  getSTKTwo(@Param('stockcode') stockcode: string) {
    
    return this.stockrequirementService.getSTKByStockcode(stockcode);
  }
}
