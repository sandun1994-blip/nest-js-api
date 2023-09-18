import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './home.dto';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}
  async getHomes(): Promise<any[]> {
    const homes = await this.prismaService.stockRequirement.findMany({
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
    return homes.map((home) => home);
  }
}
