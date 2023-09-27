import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderData } from './dtos/pdfgenerate.dto';
import { createWriteStream } from 'fs';
import { getFormatedDate } from 'src/reodertool/lib/lib';
import { MailsenderService } from 'src/mailsender/mailsender.service';
import { Prisma } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument = require('pdfkit-table');
@Injectable()
export class PdfgenerateService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailsenderService,
  ) {}

  async createPdfSendOrder(order: OrderData[]) {
    const item: {
      supplierAddress1?: string;
      supplierAddress2?: string;
      supplierAddress3?: string;
      stockLocationName?: string;
      stockLocationAddress1?: string;
      stockLocationAddress2?: string;
      stockLocationAddress3?: string;
      stockLocationAddress4?: string;
      purchaseOrder: number;
      calcReOrd?: string;
      email?: string;
      fax?: string;
      phone?: string;
      orderDate?: string;
      dispatchDate?: string;
      supplierCode?: string;
      ourCode?: string;
      description?: string;
      unit?: string;
      notes?: string;
      lineTotal?: number;
      name?: string;
      defLocationNo?: string;
      narrativeText?: string;
      loggedInUser?: string;
      statusDesc?: string;
      unitPriceExGst?: number;
    } = order[0];

    let totalExGst = 0;
    let totalGst = 0;
    order.forEach((d) => {
      totalExGst += Number(d.lineTotal);
    });
    totalGst = totalExGst * 0.1;
    const pdf = new PDFDocument({
      size: 'A4',
    });

    // pdf.image(`${process.env.LOGO_PATH}`, 25, 12, { scale: 0.5 });
    // pdf.image("../../document/DynamicsGex_Header.png", 75, 12, {
    //   fit: [120, 350],

    // });

    // customize your PDF document
    pdf
      .font('Helvetica-Bold')
      .fontSize(15)
      .text(`Purchase Order ${item.purchaseOrder} `, 325, 25, {});

    pdf
      .moveTo(325, 42) // set the current point
      .lineTo(550, 42)
      .stroke();

    pdf.fontSize(9).text(` `, 462, 22);

    pdf.font('Helvetica-Bold').fontSize(9).text(`Purchasing Officer:`, 325, 50);

    pdf
      .fontSize(8)
      .text(`PH: 07 5482 6649`, 325, 65)
      .text(`FAX: 07 5482 2296`, 325, 75)
      .text(`ABN: 53 153 273 431`, 325, 85);

    pdf.fontSize(8).text(`${item.loggedInUser}`, 415, 50);

    pdf.fontSize(9).text(`Payment Terms`, 325, 105);
    pdf.fontSize(9).text(`${item.statusDesc ?? ''}`, 395, 105);

    pdf.fontSize(9).text(`ORDER TO:`, 25, 125);
    pdf
      .fontSize(7)
      .text(`${item.name ? item.name : ''}`, 25, 140)
      .text(`${item.supplierAddress1 ? item.supplierAddress1 : ''}`, 25, 150)
      .text(`${item.supplierAddress2 ? item.supplierAddress2 : ''}`, 25, 160)
      .text(`${item.supplierAddress3 ? item.supplierAddress3 : ''}`, 25, 170);

    pdf.fontSize(9).text(`DELIVER TO:`, 280, 125);
    pdf
      .fontSize(7)
      .text(
        `${item.stockLocationAddress1 ? item.stockLocationAddress1 : ''}`,
        280,
        140,
      )
      .text(
        `${item.stockLocationAddress2 ? item.stockLocationAddress2 : ''}`,
        280,
        150,
      )
      .text(
        `${item.stockLocationAddress3 ? item.stockLocationAddress3 : ''}`,
        280,
        160,
      )
      .text(
        `${item.stockLocationAddress4 ? item.stockLocationAddress4 : ''}`,
        280,
        170,
      );

    pdf.fontSize(9).text(`INVOICE TO:`, 415, 125);
    pdf.fontSize(7).text(`accounts@dynamicsgex.com.au`, 415, 140, {
      underline: true,
    });

    pdf
      .fontSize(8)
      .text('Delivery Notes', 25, 190, {
        underline: true,
      })
      .fill('red')
      .text(`${item.notes ? item.notes : ''}`, 25, 205);

    pdf
      .fontSize(7)
      .fill('black')
      .text(`Order Date`, 415, 200)
      .text(
        `${item.orderDate ? getFormatedDate(item.orderDate) : ''}`,
        480,
        200,
      );
    pdf
      .fontSize(7)
      .fill('red')
      .text(`Despatch Date`, 415, 210)
      .text(
        `${item.dispatchDate ? getFormatedDate(item.dispatchDate) : ''}`,
        480,
        210,
      );

    pdf.fontSize(9).text(``, 1, 250).fillColor('black');

    const table = {
      headers: [
        {
          label: 'SUPPLIER CODE',
          property: 'supplierCode',
          width: 90,
          height: 20,
          renderer: null,
          align: 'left',
          headerColor: 'blue',
          headerOpacity: 0.15,
        },
        {
          label: 'DGX Code',
          property: 'ourCode',
          width: 90,
          height: 20,
          renderer: null,
          align: 'left',
          headerColor: 'blue',
          headerOpacity: 0.15,
        },
        {
          label: 'Description',
          property: 'narrativeText',
          width: 160,
          height: 20,
          align: 'left',
          headerColor: 'blue',
          headerOpacity: 0.15,
          renderer: (value, indexColumn, indexRow, row) => {
            return `${value.replace(/\r\n|\r/g, '\n')}`;
          },
        },
        {
          label: 'QTY',
          property: 'calcReOrd',
          width: 40,
          height: 20,
          renderer: null,
          align: 'right',
          headerColor: 'blue',
          headerOpacity: 0.15,
        },
        {
          label: 'Unit',
          property: 'unit',
          width: 40,
          height: 20,
          renderer: null,
          align: 'right',
          headerColor: 'blue',
          headerOpacity: 0.15,
        },
        {
          label: 'Unit Price Ex Gst',
          property: 'unitPriceExGst',
          width: 70,
          height: 20,
          align: 'right',
          headerColor: 'blue',
          headerOpacity: 0.15,
          renderer: (value, indexColumn, indexRow, row) => {
            return `$ ${Number(value).toFixed(2)}`;
          },
        },
        {
          label: 'Line Total',
          property: 'lineTotal',
          width: 70,
          height: 20,
          align: 'right',
          headerColor: 'blue',
          headerOpacity: 0.15,
          renderer: (value, indexColumn, indexRow, row) => {
            return `$ ${Number(value).toFixed(2)}`;
          },
        },
      ],

      datas: order,
    };

    pdf.table(table, {
      prepareHeader: () => pdf.font('Helvetica-Bold').fontSize(8),
      x: 25,
    });

    //console.log(10*q.length);

    pdf.moveDown();

    pdf
      .fontSize(7)
      .fill('red')
      .text(
        'PLEASE ENSURE A COPY OF THIS PURCHASE ORDER IS INCLUDED WITH THE SHIPMENT TO AVOID PAYMENT DELAYS',
        100,
      );

    pdf.moveDown();

    pdf
      .moveTo(30, pdf.page.height - 70) // set the current point
      .lineTo(550, pdf.page.height - 70)
      .stroke();
    pdf
      .fontSize(7)
      .fill('red')
      .text(
        'NO PRICE INCREASES WILL BE ACCEPTED ONCE GOODS HAVE BEEN DESPATCHED FROM SUPPLIER',
        35,
        pdf.page.height - 60,
        {
          lineBreak: false,
        },
      )
      .fill('black')
      .text('SubTotal', 430, pdf.page.height - 60, {
        lineBreak: false,
      })
      .text(`$ ${totalExGst.toFixed(2)}`, 470, pdf.page.height - 60, {
        lineBreak: false,
        align: 'right',
      })
      .text(
        'Please quote purchase order number on all correspondance/invoices.',
        35,
        pdf.page.height - 50,
        {
          lineBreak: false,
        },
      )
      .text('GST', 430, pdf.page.height - 50, {
        lineBreak: false,
      })
      .text(`$ ${totalGst.toFixed(2)}`, 470, pdf.page.height - 50, {
        lineBreak: false,
        align: 'right',
      })
      .text(
        'Failure to do so will cause delay in payment. Unless otherwise stated, this order is',
        35,
        pdf.page.height - 40,
        {
          lineBreak: false,
        },
      )
      .text('Amount', 430, pdf.page.height - 40, {
        lineBreak: false,
      })
      .text(
        `$ ${(totalGst + totalExGst).toFixed(2)}`,
        470,
        pdf.page.height - 40,
        {
          lineBreak: false,
          align: 'right',
        },
      )
      .text(
        'subject to Dynamics G-Ex standard terms and conditions, a copy is available on request.',
        35,
        pdf.page.height - 30,
        {
          lineBreak: false,
        },
      );
    pdf
      .moveTo(30, pdf.page.height - 10) // set the current point
      .lineTo(550, pdf.page.height - 10)
      .stroke();

    //
    pdf.pipe(
      createWriteStream(
        `${process.env.SEND_ORDER_PDF_PATH}/${item.purchaseOrder}.pdf`,
      ),
    );
    pdf.end();

    const updatePurchOrder = async (seqNo: number) => {
      await this.prismaService.$transaction(
        async (tx) => {
          // Code running in a transaction...
          try {
            await tx.purchaseOrder.update({
              where: {
                seqNo,
              },
              data: { automail: 'Y' },
            });
          } catch (error) {
            console.log(error);
          }
        },
        {
          maxWait: 5000, // default: 2000
          timeout: 10000, // default: 5000
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
        },
      );
    };

    await this.mailService
      .sendOrder(item.purchaseOrder as number)
      .then(() => {
        updatePurchOrder(item.purchaseOrder);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
