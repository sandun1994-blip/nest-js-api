import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { ReodertoolService } from './reodertool.service';
import { SendataDto } from './dtos/reordertool.dto';

type BodyData = { data: SendataDto[]; name: string };
@Controller('reodertool')
export class ReodertoolController {
  constructor(private readonly service: ReodertoolService) {}

  @UseGuards(AuthGuard)
  @Post('sendorder')
  sendOrder(@Body() body: BodyData) {
    return this.service.sendOrder(body);
  }

  @UseGuards(AuthGuard)
  @Post('sendtransfer')
  sendTransfer(@Body() body: BodyData) {
    return this.service.sendTransfer(body);
  }

  @UseGuards(AuthGuard)
  @Post('addpauseitem')
  public async insertPauseItems(@Body() body: any): Promise<any> {
    return this.service.insertPauseItems(body);
  }

  @UseGuards(AuthGuard)
  @Get('getpauseitem')
  public async getALLPauseItems(): Promise<any> {
    return this.service.getALLPauseItems();
  }
}
