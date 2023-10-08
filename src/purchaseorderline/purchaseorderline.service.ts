import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PurchaseorderlineService {
  constructor(private readonly prismaService: PrismaService) {}

  async createByStoredProcedure(dto: any): Promise<any> {
    return await this.prismaService.$transaction(
      async (tx) => {
        try {
          const result =
            await tx.$queryRaw`DECLARE @OUT_SEQNO int;EXEC @OUT_SEQNO=CREATE_PO_LINES @HDR_SEQNO=${dto.purchaseOrder.seqNo} ,@STOCKCODE=${dto.stockItem.stockCode} ,@ORD_QTY=${dto.orderQty},@LOCATION=${dto.location}, @LINE_SEQNO=@OUT_SEQNO OUTPUT;SELECT @OUT_SEQNO;`;

          const seqNo = result[0][''];
          return await tx.purchaseOrderLine.findUnique({
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
        } catch (error) {
          console.log(error);
          throw new HttpException(error, 400);
        }
      },
      {
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
      },
    );
  }
}
