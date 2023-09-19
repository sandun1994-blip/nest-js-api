import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SupplierstockitemsService {
  constructor(private readonly prismaService: PrismaService) {}
  async supplierstockitems(): Promise<any[]> {
    const stk = await this.prismaService.stockRequirement.findMany({
      include: {
        stockItem: {
          include: {
            billomatHdr: {
              include: { workOrder: true, billomatLines: true },
            },
          },
        },
        stockLocation: true,
        supplierAccount: {
          include: {
            creditStatuses: true,
          },
        },
      },
    });
    return stk.map((item) => item);
  }
}
