import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SupplieraccountService {
  constructor(private readonly prismaService: PrismaService) {}
  async getAllSup(): Promise<any[]> {
    const sup = await this.prismaService.supplierAccount.findMany({
      // take: 100,
      select: {
        accNo: true,
        name: true,
        creditStatus: true,
        currencyNo: true,
        address1: true,
        address2: true,
        address3: true,
        address4: true,
        address5: true,
        creditStatuses: true,
      },
    });
    return sup;
  }
}
