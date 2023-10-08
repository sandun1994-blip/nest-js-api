import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PurchaseorderService {
  constructor(private readonly prismaService: PrismaService) {}

  async createByStoredProcedure(dto: any): Promise<any> {
    return await this.prismaService.$transaction(
      async (tx) => {
        // Code running in a transaction...
        const result =
          await tx.$queryRaw`DECLARE @OUT_SEQNO int;EXEC @OUT_SEQNO=CREATE_PO_HEADER @ACCNO=${dto.supplierAccount.id},@ORDERDATE=${dto.orderDate},@SALESNO=${dto.salesNo},@BRANCHNO=${dto.branch.branchNo}, @LOCATION=${dto.defLocationNo}, @HDR_SEQNO=@OUT_SEQNO OUTPUT;SELECT @OUT_SEQNO;`;
        const seqNo = result[0][''];
        // console.log(seqNo);

        return await tx.purchaseOrder.findUnique({
          where: {
            seqNo,
          },
          include: {
            supplierAccount: {
              include: {
                creditStatuses: true,
              },
            },
            branch: true,
          },
        });
      },
      {
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
      },
    );
  }

  async updatePOTotalsByStoredProcedure(id: number) {
    await this.prismaService.$transaction(
      async (tx) => {
        // Code running in a transaction...
        await tx.$queryRaw`EXEC UPDATE_PO_TOTAL @HDR_SEQNO =${id}`;
      },
      {
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
      },
    );
  }
}
