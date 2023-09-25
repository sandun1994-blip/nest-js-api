import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StockrequirementService {
  constructor(private readonly prismaService: PrismaService) {}
  async getStockrequirement(): Promise<any[]> {
    const stk = await this.prismaService.stockRequirement.findMany({
      // take: 100,
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

  async getSTKByStockcode(stockcode): Promise<any[]> {
    const stk = await this.prismaService.stockRequirementTwo.findMany({
      where: {
        stockCode: stockcode,
        stockLocation: {
          lName: {
            endsWith: 'WAREHOUSE',
          },
        },
      },
      include: {
        stockLocation: true,
      },
    });
    return stk.map((item) => item);
  }
}
