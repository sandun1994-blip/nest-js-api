import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StockrequirementService } from './stockrequirement.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('stockrequirement')
export class StockrequirementController {
  constructor(
    private readonly stockrequirementService: StockrequirementService,
  ) {}
  @UseGuards(AuthGuard)
  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: string,
  ) {
   // console.log(city, minPrice, maxPrice, propertyType, 'ok');
    return this.stockrequirementService.getStockrequirement();
  }
}