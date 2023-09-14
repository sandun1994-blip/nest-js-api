import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { HomeService } from './home.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}
  @UseGuards(AuthGuard)
  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: string,
  ) {
    console.log(city, minPrice, maxPrice, propertyType, 'ok');
    // return this.homeService.getHomes();

    return 'hello yo';
  }
}
