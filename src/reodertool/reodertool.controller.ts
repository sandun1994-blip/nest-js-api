import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { ReodertoolService } from './reodertool.service';

@Controller('reodertool')
export class ReodertoolController {
  constructor(private readonly service: ReodertoolService) {}

  @UseGuards(AuthGuard)
  @Post('sendorder')
  sendOrder(@Body() body: any) {
    return this.service.sendOrder(body);
  }
}
