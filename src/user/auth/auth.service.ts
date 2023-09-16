import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const EXPIRE_TIME = 20 * 1000;
interface SignupParams {
  email: string;
  password: string;
  name: string;
  phone: string;
}

interface SigninParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup({ email, password, name, phone }: SignupParams) {
    const userExistes = await this.prismaService.user.findUnique({
      where: { email },
    });
    // console.log(userExistes);

    if (userExistes) {
      throw new ConflictException();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        user_type: 'USER',
      },
    });

    return this.generateJWT(user.name, user.id);
  }

  async signin({ email, password }: SigninParams) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', 400);
    }
    const hashedPassword = user.password;

    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if (!isValidPassword) {
      throw new HttpException('Invalid credentials', 400);
    }

    return {
      user,
      backendTokens: {
        accessToken: await this.generateJWT(user.name, user.id),
        refreshToken: await this.generateRefreshJWT(user.name, user.id),
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
      },
    };
  }

  private async generateJWT(name: string, id: number) {
    return await jwt.sign({ name, id }, process.env.JWT_SECRET, {
      expiresIn: '20s',
    });
  }

  private async generateRefreshJWT(name: string, id: number) {
    return await jwt.sign({ name, id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });
  }

  async refreshToken(user: any) {
    console.log(user);

    return {
      accessToken: await this.generateJWT(user.name, user.id),
      refreshToken: await this.generateRefreshJWT(user.name, user.id),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };
  }
}

// 5:42
