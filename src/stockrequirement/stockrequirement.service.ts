import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StockrequirementService {
  constructor(private readonly prismaService: PrismaService) {}
  async getStockrequirement(): Promise<any[]> {
    const stk = await this.prismaService.stockRequirement.findMany({
      include: {
        stockItem: {
          include: {
            billomatHdr: {
              include: { workOrder: true, billomatLines: true },
            },
            supplierStockItems: {
              include: {
                supplierAccount: true,
              },
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