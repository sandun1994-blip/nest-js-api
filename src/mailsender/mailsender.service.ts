import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MailsenderService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly prismaService: PrismaService,
  ) {}

  async sendOrder(id: number): Promise<any> {
    const body = `

    <!DOCTYPE html>
    <html>
    <head>
    <style>
    #stock {
      font-family: Arial, Helvetica, sans-serif;
      border-collapse: collapse;
      width: 100%;
    }

    #stock td, #stock th {

      padding: 8px;
    }



    #stock th {
      padding-top: 12px;
      padding-bottom: 12px;
      text-align: left;

    }
    </style>
    </head>
    <body>

   <h5 style="color:"black">Hello Team,</h5>
   <h5></h5>
   <h5 style="color:"black">Please find attached our Purchase Order, if you could please  advise lead time that would be greatly appreciated.</h5>
   <h5></h5>
   <h5 style="color:"black">Once the order is ready for dispatch, please email <a href="mailto:purchasing@dynamicsgex.com.au">purchasing@dynamicsgex.com.au</a> with the W&D's and or a freight quote, please ensure the quote is approved prior to all orders being dispatched.</h5>
   <h5></h5>
   <h5>Thank you in advance, looking forward to hearing from you soon.</h5>
   <h5></h5>
   <h5 style="color:"black">Many Thanks </h5>
   <h5></h5>
   <h5 style="color:"black">Dynamics G-Ex Purchasing Team</h5>
   </body>
    </html>

    `;

    return await this.mailerService.sendMail({
      to: 'sandun.suntws@gmail.com',
      from: process.env.HOST_MAIL,
      subject: 'Testing Nest Mailermodule with template ✔',
      html: body,
      attachments: [
        {
          // utf-8 string as an attachmenthttps
          filename: `${id}.pdf`,
          path: `${process.env.SEND_ORDER_PDF_PATH}/${id}.pdf`,
        },
      ],
      context: {
        // Data to be sent to template engine.
        // code: 'cf1a3f828287',
        username: 'OneSys',
      },
    });
  }
}
