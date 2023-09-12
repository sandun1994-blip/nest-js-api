import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface SignupParams {
  email: string;
  password: string;
  name: string;
  phone: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup({ email }: SignupParams) {
    const userExistes = await this.prismaService.user.findUnique({
      where: { email }
    });
   // console.log(userExistes);
    
    return userExistes
  }
}


// 4:42