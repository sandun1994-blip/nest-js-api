import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StockrequirementService {
  constructor(private readonly prismaService: PrismaService) {}
  async getStockrequirement(): Promise<any[]> {
    try {
      const stk = await this.prismaService.stockRequirement.findMany({
         take: 10,
        include: {
          stockItem: {
            include: {
              billomatHdr: {
                include: { workOrder: true, billomatLines: true },
              },
              supplierStockItems: {
                include: {
                  supplierAccount: {
                    include: {
                      creditStatuses: true,
                    },
                  },
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
    } catch (error) {
      console.log(error);
    }
  }

  async getSTKByStockcode(stockcode: any): Promise<any[]> {
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

  async refreshStocks(supplierNo: number) {
    await this.prismaService.$transaction(
      async (tx) => {
        // Code running in a transaction...
        await tx.$queryRaw`EXEC CALC_STKREQUIREMENT @SUPPLIERNO =${supplierNo}`;
      },
      {
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
      },
    );
  }
}
