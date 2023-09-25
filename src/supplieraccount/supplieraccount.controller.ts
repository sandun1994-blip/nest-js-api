import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SupplieraccountService } from './supplieraccount.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('supplieraccount')
export class SupplieraccountController {
  constructor(private readonly service: SupplieraccountService) {}
  @UseGuards(AuthGuard)
  @Get()
  getSTK(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: string,
  ) {
    // console.log(city, minPrice, maxPrice, propertyType, 'ok');
    return this.service.getAllSup();
  }
}
