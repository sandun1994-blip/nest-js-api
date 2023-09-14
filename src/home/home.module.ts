import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [HomeController],
  providers: [HomeService],
  imports: [PrismaModule],
})
export class HomeModule {}
