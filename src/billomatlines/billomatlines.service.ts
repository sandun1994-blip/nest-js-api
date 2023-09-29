import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BillomatlinesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getByStockcode(stockCode: string): Promise<any> {
    const result = await this.prismaService.billomatLines.findMany({
      where: {
        billomatHdr: {
          billCode: stockCode,
        },
      },

      include: {
        billomatHdr: true,
        stockItem: {
          include: {
            stockRequirementTwo: {
              include: {
                stockLocation: true,
                supplierAccount: {
                  include: {
                    creditStatuses: true,
                  },
                },
              },
            },
            stockLocationsInfo: true,
            stockGroup: true,
            supplierStockItems: {
              include: {
                supplierAccount: { include: { creditStatuses: true } },
              },
            },
          },
        },
      },
    });

    return result;
  }
}
