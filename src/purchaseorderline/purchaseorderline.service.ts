import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PurchaseorderlineService {
  constructor(private readonly prismaService: PrismaService) {}

  async createByStoredProcedure(dto: any): Promise<any> {
    const result = await this.prismaService
      .$queryRaw`DECLARE @OUT_SEQNO int;EXEC @OUT_SEQNO=CREATE_PO_LINES @HDR_SEQNO=${dto.purchaseOrder.seqNo} ,@STOCKCODE=${dto.stockItem.stockCode} ,@ORD_QTY=${dto.orderQty},@LOCATION=${dto.location}, @LINE_SEQNO=@OUT_SEQNO OUTPUT;SELECT @OUT_SEQNO;`;
    const seqNo = result[0][''];
    return await this.prismaService.purchaseOrderLine.findUnique({
      where: {
        seqNo,
      },
      include: {
        purchaseOrder: {
          include: {
            supplierAccount: {
              include: {
                creditStatuses: true,
              },
            },
            branch: true,
          },
        },
        stockItem: {
          include: { stockGroup: true },
        },
        narratives: true,
      },
    });
  }
}
