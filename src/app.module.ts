import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { HomeModule } from './home/home.module';
import { ConfigModule } from '@nestjs/config';
import { StockrequirementModule } from './stockrequirement/stockrequirement.module';

@Module({
  imports:[ConfigModule.forRoot(), UserModule, PrismaModule, HomeModule, StockrequirementModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
