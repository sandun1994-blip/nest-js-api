import { Controller } from '@nestjs/common';
import { BillomatlinesService } from './billomatlines.service';


@Controller('billomatlines')
export class BillomatlinesController {
  constructor(private readonly billomatlinesService: BillomatlinesService) {}
}
