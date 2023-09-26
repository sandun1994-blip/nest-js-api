import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PurchaseorderService {
  constructor(private readonly prismaService: PrismaService) {}

  async createByStoredProcedure(dto: any): Promise<any> {
    const result = await this.prismaService
      .$queryRaw`DECLARE @OUT_SEQNO int;EXEC @OUT_SEQNO=CREATE_PO_HEADER @ACCNO=${dto.supplierAccount.id},@ORDERDATE=${dto.orderDate},@SALESNO=${dto.salesNo},@BRANCHNO=${dto.branch.branchNo}, @LOCATION=${dto.defLocationNo}, @HDR_SEQNO=@OUT_SEQNO OUTPUT;SELECT @OUT_SEQNO;`;
    const seqNo = result[0][''];
    return await this.prismaService.purchaseOrder.findUnique({
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
  }
}
