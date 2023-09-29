import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BillomathdrService {
  constructor(private readonly prismaService: PrismaService) {}

  async getByStockcode(stockCode: string): Promise<any> {
    const result = await this.prismaService.billomatHdr.findMany({
      where: {
        billCode: stockCode,
      },
      include: {
        billomatLines: {
          include: {
            stockItem: {
              include: {
                stockRequirementTwo: {
                  include: {
                    stockLocation: true,
                    stockItem: {
                      include: { stockGroup: true },
                    },
                    supplierAccount: {
                      include: {
                        creditStatuses: true,
                      },
                    },
                  },
                },
                stockGroup: true,
              },
            },
          },
        },
      },
    });

    return result;
  }
}
