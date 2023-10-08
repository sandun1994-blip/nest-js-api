import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorkorderService {
  constructor(private readonly prismaService: PrismaService) {}

  async createWoAndLines(body: any) {
    const sendData = async (data: any, user: any) => {
      return await this.processWoAndLines(data, user);
    };


    const numberOfItems = body.data.length;
    const woStatus = [];

    const callEachOrder = async (index: number) => {
      if (numberOfItems < index + 1) {
        return;
      } else {
        const promises = [body.data[index]].map((data) =>
          sendData(data, body.user),
        );
        const result = await Promise.allSettled(promises);
        woStatus.push(result[0]);

        await callEachOrder(index + 1);
      }
    };
    await callEachOrder(0);
    return woStatus;
  }

  async processWoAndLines(dto: any, user: any) {
    try {
      const response: any = await this.prismaService
        .$queryRaw`DECLARE @OUT_SEQNO int;EXEC @OUT_SEQNO=CREATE_WO_HEADER @TRANSDATE=${dto.transDate} ,@SALESNO=${user.staffNo} ,@BILLCODE=${dto.billCode} , @PRODQTY=${dto.prodQty}, @PRODLOCNO=${dto.prodLocNo},@HDR_SEQNO=@OUT_SEQNO OUTPUT;SELECT @OUT_SEQNO;`;

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
}
