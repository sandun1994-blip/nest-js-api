import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { getDate } from './lib/lib';
import { PurchaseorderService } from 'src/purchaseorder/purchaseorder.service';
import { SendataDto } from './dtos/reordertool.dto';
import { PurchaseorderlineService } from 'src/purchaseorderline/purchaseorderline.service';

type BodyData = { data: SendataDto[]; name?: string };

@Injectable()
export class ReodertoolService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly purchaseOrder: PurchaseorderService,
    private readonly purchaseOrderLine: PurchaseorderlineService,
  ) {}

  async sendOrder(body: BodyData): Promise<any> {
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

    const orderData = [];

    for (const [supNumber, poLines] of supplierMap) {
      orderData.push({ supNumber, poLines });
    }

    const sendData = async (time: number, supNumber: number, poLines: any[]) =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          const response = this.sendMailAndData(
            time,
            supNumber,
            poLines,
            body.name,
          );
          response
            .then((res) => {
              resolve(res);
            })
            .catch((err) => reject(err));
        }, 5000 * time);
      });

    const promises = orderData.map((data, time: number) =>
      sendData(time, data.supNumber, data.poLines),
    );

    return await Promise.allSettled(promises);
  }

  async sendMailAndData(
    time: number,
    supNumber: number,
    poLines: any[],
    userName: string,
  ) {
    try {
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

      const poOrder =
        await this.purchaseOrder.createByStoredProcedure(purchaseOrder);

      let poOrderLine;
      const poOrderLines = [];
      for (let index = 0; index < poLines.length; index++) {
        const element = poLines[index];
        const purchaseOrderLine: any = {
          seqNo: null,
          purchaseOrder: {
            seqNo: poOrder.seqNo,
            supplierAccount: element.supplierAccount,
          },
          stockItem: element.stockItem,
          status: 0,
          branch: { branchNo: element.locationNumber },
          location: element.locationNumber,
          dueDate: getDate(new Date()),
          unitPrice: element.stockItem.sellPrice1,
          orderQty: element.calcReOrd,
          orderNow: element.calcReOrd,
          purchasePackQty: 0,
          purchasePackPrice: 0,
          sellPrice: element.stockItem.sellPrice1,
          costQty: 0,
          priceOverridden: 0,
          linkedStockCode: element.stockItem.stockCode,
        };
        poOrderLine =
          await this.purchaseOrderLine.createByStoredProcedure(
            purchaseOrderLine,
          );
        const poReturnData = [poOrderLine].map((d) => {
          return {
            supplierAddress1: d.purchaseOrder.supplierAccount.address1,
            supplierAddress2: d.purchaseOrder.supplierAccount.address2,
            supplierAddress3: d.purchaseOrder.supplierAccount.address3,
            stockLocationName: element.locationName,
            stockLocationAddress1: element.locationAddress1,
            stockLocationAddress2: element.locationAddress2,
            stockLocationAddress3: element.locationAddress3,
            stockLocationAddress4: element.locationAddress4,
            purchaseOrder: d.purchaseOrder.seqNo,
            calcReOrd: d.orderQty,
            email: d.purchaseOrder.supplierAccount.email,
            fax: d.purchaseOrder.supplierAccount.fax,
            phone: d.purchaseOrder.supplierAccount.phone,
            orderDate: d.purchaseOrder.orderDate,
            dispatchDate: d.purchaseOrder.dueDate,
            supplierCode: element.supplierCode,
            ourCode: d.stockItem.stockCode,
            unit: 'EACH',
            unitPriceExGst: d.unitPrice,
            notes: d.purchaseOrder.deleveryNotes,
            description: d.stockItem.description,
            lineTotal: (
              parseFloat(d.unitPrice) * parseFloat(d.orderQty)
            ).toFixed(2),
            name: d.purchaseOrder.supplierAccount.name,
            defLocationNo: d.purchaseOrder.defLocationNo,
            subTotal: (
              parseFloat(d.unitPrice) * parseFloat(d.orderQty)
            ).toFixed(2),
            narrativeText: d.narratives
              ? d.narratives.narrative.substring(0, 350)
              : d.stockItem.description.substring(0, 350),
            loggedInUser: userName,
            statusDesc: element.supplierAccount.creditStatus.statusDesc,
            currencyNo:
              d.purchaseOrder.supplierAccount.currencyNo === 0 ? 'AU$' : 'US$',
          };
        });
        poOrderLines.push(poReturnData[0]);
      }

      // console.log(poOrderLines);

      // if (poOrderLines.length > 0) {
      //   await services.mailSender.sendUserConfirmation(poOrderLines);
      //   await services.purch.updatePOTotalsByStoredProcedure(poOrder.seqNo);
      //   await services.stockRequirement.refreshStocks(supNumber);
      // }

      return { res: 'sucess' };
    } catch (error) {
      console.log(error);

      throw new HttpException('Invalid credentials', 400);
    }
  }
}
