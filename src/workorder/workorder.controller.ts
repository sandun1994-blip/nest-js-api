import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { WorkorderService } from './workorder.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('workorder')
export class WorkorderController {
  constructor(private readonly workorderService: WorkorderService) {}

  @UseGuards(AuthGuard)
  @Post('wo/woline')
  sendOrder(@Body() body: any) {
    return this.workorderService.createWoAndLines(body);
  }

  @Post('test')
  createTest(@Body() body: any) {
    return this.workorderService.createTest(body);
  }

}
