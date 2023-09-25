import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { getDate } from './lib/lib';
import { PurchaseorderService } from 'src/purchaseorder/purchaseorder.service';

@Injectable()
export class ReodertoolService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly purchaseOrder: PurchaseorderService,
  ) {}

  async sendOrder(body: any): Promise<any[]> {
    const supplierMap = new Map();
    let supplierNumber = 0;

    body.data.length > 0 &&
      body.data.forEach((d: any) => {
        supplierNumber = d.supplierNumber;
        if (supplierMap.has(supplierNumber)) {
          supplierMap.set(supplierNumber, [
            ...supplierMap.get(supplierNumber),
            d,
          ]);
        } else {
          supplierMap.set(supplierNumber, [d]);
        }
      });

    let i = 0;
    for (const [supNumber, poLines] of supplierMap) {
      i++;
      const purchaseOrder: any = {
        seqNo: null,
        status: 0,
        orderDate: getDate(new Date()),
        salesNo: 1,
        defLocationNo: poLines[0].locationNumber,
        dueDate: getDate(new Date()),
        supplierAccount: {
          id: poLines[0].supplierAccount.accNo,
          name: poLines[0].supplierAccount.name,
          currencyNo: poLines[0].supplierAccount.currencyNo,
        },
        address1: poLines[0].supplierAccount.address1,
        address2: poLines[0].supplierAccount.address2,
        address3: poLines[0].supplierAccount.address3,
        address4: poLines[0].supplierAccount.address4,
        address5: poLines[0].supplierAccount.address5,
        branch: { branchNo: poLines[0].locationNumber },
      };
      try {
        const poOrder =
          await this.purchaseOrder.createByStoredProcedure(purchaseOrder);
      } catch (error) {
        console.log(error);
        throw new HttpException('Invalid credentials', 400);
      }
    }
    return;
  }
}
