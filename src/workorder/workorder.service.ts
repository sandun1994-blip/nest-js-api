import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorkorderService {
  constructor(private readonly prismaService: PrismaService) {}

  async createWoAndLines(body: any) {
    const sendData = async (data: any, time: number) => {
      await new Promise((resolve) => setTimeout(resolve, 1000 * time));
      return await this.processWoAndLines(data);
    };
    console.log('worko');

    const promises = body.data.map((data: any, i: any) => sendData(data, i));

    return await Promise.allSettled(promises);
  }

  async processWoAndLines(dto: any) {
    try {
      const response: any = await this.prismaService
        .$queryRaw`DECLARE @OUT_SEQNO int;EXEC @OUT_SEQNO=CREATE_WO_HEADER @TRANSDATE=${dto.transDate} ,@SALESNO=${dto.salesNo} ,@BILLCODE=${dto.billCode} , @PRODQTY=${dto.prodQty}, @PRODLOCNO=${dto.prodLocNo},@HDR_SEQNO=@OUT_SEQNO OUTPUT;SELECT @OUT_SEQNO;`;

      const seqNo = response[0][''];

      if (seqNo > 0) {
        const responseTwo = await this.prismaService.workOrder.findUnique({
          where: { seqNo },
        });
        const woLine = {
          seqNo: responseTwo.seqNo,
          stockCode: responseTwo.billCode,
          orderQty: dto.prodQty,
        };

        await this.prismaService
          .$queryRaw`DECLARE @OUT_SEQNO int;EXEC @OUT_SEQNO=CREATE_WO_LINES @HDR_SEQNO=${woLine.seqNo},@STOCKCODE=${woLine.stockCode},@ORD_QTY=${woLine.orderQty} SELECT @OUT_SEQNO;`;

        return responseTwo;
      }
    } catch (error) {
      //   console.log(error,'ppppp');
      console.log(error);

      throw new HttpException(error, 400);
    }
  }

  async createTest(dto) {
    console.log(dto);
    const data = [];
    for (let index = 0; index < 100; index++) {
      data.push(index);
    }

    for (let index = 0; index < data.length; index++) {
      const element = data[index];

      await this.prismaService.loopTable.create({
        data: { num: element },
      });
      const res = await this.prismaService.loopTable.findUnique({
        where: { id: index },
      });
      console.log(res);
      
      if (res) {
        await this.prismaService.loopTable.update({
          data: { num: element * 2 },
          where: { id: res.id },
        });
      }
    }
    for (let index = 0; index < data.length; index++) {
      const element = data[index];

      await this.prismaService.loopTable.create({
        data: { num: element },
      });
      const res = await this.prismaService.loopTable.findUnique({
        where: { id: index },
      });
      if (res) {
        await this.prismaService.loopTable.update({
          data: { num: element * 2 },
          where: { id: res.id },
        });
      }
    }
  }
}
