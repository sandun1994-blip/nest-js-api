import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { getDate } from './lib/lib';
import { PurchaseorderService } from 'src/purchaseorder/purchaseorder.service';
import { SendataDto } from './dtos/reordertool.dto';
import { PurchaseorderlineService } from 'src/purchaseorderline/purchaseorderline.service';
import { PdfgenerateService } from 'src/pdfgenerate/pdfgenerate.service';
import { StockrequirementService } from 'src/stockrequirement/stockrequirement.service';
import { Prisma } from '@prisma/client';

type BodyData = { data: SendataDto[]; user?: string };

@Injectable()
export class ReodertoolService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly purchaseOrder: PurchaseorderService,
    private readonly purchaseOrderLine: PurchaseorderlineService,
    private readonly pdfgenerateService: PdfgenerateService,
    private readonly stockrequirementService: StockrequirementService,
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

    const sendData = async (
      time: number,
      supNumber: number,
      poLines: any[],
      name: string,
    ) => {
      // await new Promise((resolve) => setTimeout(resolve, 7000 * time));
      return await this.sendMailAndData(time, supNumber, poLines, name);
    };
    // const promises = orderData.map((data, time: number) =>
    //   sendData(time, data.supNumber, data.poLines, body?.user),
    // );
    // const result = await Promise.allSettled(promises);
    const numberOfItems = orderData.length;
    const orderStatus = [];

    const callEachOrder = async (index: number) => {
      console.log(numberOfItems, index);

      if (numberOfItems < index + 1) {
        return;
      } else {
        const promises = [orderData[index]].map((data, time: number) =>
          sendData(time, data.supNumber, data.poLines, body?.user),
        );
        const result = await Promise.allSettled(promises);
        orderStatus.push(result[0]);
        console.log(result);

        await callEachOrder(index + 1);
      }
    };
    await callEachOrder(0);
    return orderStatus;
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

      const poOrderLines = [];
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      const createOrderLineByRecursion = async (index: number) => {
        console.log(poLines.length, index);

        if (poLines.length - 1 < index) {
          return;
        } else {
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

          const poOrderLine =
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
              orderDate: getDate(d.purchaseOrder.orderDate),
              dispatchDate: getDate(d.purchaseOrder.dueDate),
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
              statusDesc: element.supplierAccount.creditStatuses.statusDesc,
              currencyNo:
                d.purchaseOrder.supplierAccount.currencyNo === 0
                  ? 'AU$'
                  : 'US$',
            };
          });
          poOrderLines.push(poReturnData[0]);

          await createOrderLineByRecursion(index + 1);
        }
      };
      await createOrderLineByRecursion(0);
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // console.log(poOrderLines);

      if (poOrderLines.length > 0) {
        await this.pdfgenerateService.createPdfSendOrder(poOrderLines);
        await this.purchaseOrder.updatePOTotalsByStoredProcedure(poOrder.seqNo);
        await this.stockrequirementService.refreshStocks(supNumber);
      }

      return { poNumber: poOrder.seqNo };
    } catch (error) {
      console.log(error);

      throw new HttpException(error, 400);
    }
  }

  // send transfer

  async sendTransfer(body: BodyData): Promise<any> {
    const supplierMap = new Map();
    let fromLoc = 0;
    let supplierLocFromToNumber = '';

    body.data.length > 0 &&
      body.data.forEach((d: any) => {
        if (
          d.name.name.toLowerCase().trim() ===
          process.env.LOCATION_GYMPIE.toLowerCase().trim()
        ) {
          fromLoc = 1;
        } else if (
          d.name.name.toLowerCase().trim() ===
          process.env.LOCATION_MALAGA.toLowerCase().trim()
        ) {
          fromLoc = 5;
        } else {
          fromLoc = d.fromLoc;
        }

        supplierLocFromToNumber =
          fromLoc.toString() + d.locationNumber.toString();

        if (supplierMap.has(supplierLocFromToNumber)) {
          supplierMap.set(supplierLocFromToNumber, [
            ...supplierMap.get(supplierLocFromToNumber),
            d,
          ]);
        } else {
          supplierMap.set(supplierLocFromToNumber, [d]);
        }
      });

    const orderData = [];

    for (const [fromTo, srLines] of supplierMap) {
      orderData.push({ fromTo, srLines });
    }

    const sendTransfer = async (
      time: number,
      fromTo: number | string,
      srLines: any[],
    ) => {
      return await this.sendTransferData(time, fromTo, srLines);
    };

    ///////////////////////////////////////////////////////////////////////////////////////
    const numberOfItems = orderData.length;
    const transferStatus = [];

    const callEachOrder = async (index: number) => {
      console.log(numberOfItems, index);

      if (numberOfItems - 1 < index) {
        return;
      } else {
        const promises = [orderData[index]].map((data, time: number) =>
          sendTransfer(time, data.fromTo, data.srLines),
        );
        const result = await Promise.allSettled(promises);
        transferStatus.push(result[0]);

        await callEachOrder(index + 1);
      }
    };
    ///////////////////////////////////////////////////////////////////////////////////////////
    await callEachOrder(0);
    return transferStatus;
  }

  /////////////////////////
  async sendTransferData(
    time: number,
    fromTo: number | string,
    srLines: any[],
  ): Promise<any> {
    const element: any = srLines[0];
    const stockRequest = {
      fromLoc: element.fromLoc,
      toLoc: element.locationNumber,
      requestDate: new Date(),
      requireDate: new Date(),
      staffNo: 2,
      status: 0,
      transType: 1,
      custOrderNo: null,
      narrativeSeqNo: 0,
      origSeqNo: 0,
    };
    //  console.log(stockRequest);
    try {
      const srResponse = await this.prismaService.stockRequests.create({
        data: stockRequest,
      });

      const sendData = async (srp: any, line: any) => {
        const response = await this.prismaService.$transaction(
          async (tx) => {
            // Code running in a transaction...
            return await tx.narratives.create({
              data: { narrative: line?.stockItem?.notes },
            });
          },
          {
            maxWait: 5000, // default: 2000
            timeout: 10000, // default: 5000
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
          },
        );

        const stockRequestLine = {
          hdrSeqNo: srp.seqNo,
          stockCode: line.stockCode,
          description: line.description,
          packSize: 1,
          reqQuant: parseInt(line.calcReOrd),
          supQuant: 0,
          comment: null,
          batchCode: null,
          lineType: 0,
          linkedStockCode: line.stockCode,
          linkedQty: 1,
          bomType: 'N',
          showLine: 'Y',
          likedStatus: 'S',
          bomPricing: 'N',
          narrrativeSeqNo: response.seqNo,
          lostQuant: 0,
          sentQuant: 0,
          sendNow: 0,
          supNow: 0,
          soLineId: -1,
        };
        await this.prismaService.$transaction(
          async (tx) => {
            // Code running in a transaction...
            return await tx.stockRequestlines.create({
              data: stockRequestLine,
            });
          },
          {
            maxWait: 5000, // default: 2000
            timeout: 10000, // default: 5000
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
          },
        );
      };

      const createTransferLineByRecursion = async (index: number) => {
        console.log(index);

        if (srLines.length - 1 < index) {
          return;
        } else {
          await sendData(srResponse, srLines[index]);
          await createTransferLineByRecursion(index + 1);
        }
      };

      await createTransferLineByRecursion(0);

      return srResponse;
    } catch (error) {
      console.log(error);
    }
  }

  /////////inset pause items //////////////////

  async insertPauseItems(dto: any) {
    return await this.prismaService.reorderPauseItems.create({ data: dto });
  }

  async getALLPauseItems() {
    await this.prismaService
      .$queryRaw`DELETE FROM REORDER_TOOL_REMOVE_ITEM_TEMPORARILY WHERE  getdate() >= DATEADD(day, hiddenDay, insertDate)`;
    return await this.prismaService.reorderPauseItems.findMany();
  }

  async deleteItemById(id: number) {
    return await this.prismaService.reorderPauseItems.delete({
      where: { id },
    });
  }
}
