import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { SupplierstockitemsService } from './supplierstockitems.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('supplierstockitems')
export class SupplierstockitemsController {
  constructor(
    private readonly supplierstockitemsService: SupplierstockitemsService,
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
    return this.supplierstockitemsService.supplierstockitems();
  }

  @UseGuards(AuthGuard)
  @Post('accnoandcode')
  signin(@Body() body: { accNo: number[]; code: string[] }) {
    return this.supplierstockitemsService.getAccountByCodeAndNo(body);
  }
}
