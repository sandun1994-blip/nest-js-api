import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const EXPIRE_TIME = 20 * 60000 * 24;
interface SignupParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  age: number;
}

interface SigninParams {
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup({
    email,
    password,
    firstName,
    lastName,
    username,
    age,
  }: SignupParams) {
    const userExistes = await this.prismaService.user.findUnique({
      where: { username },
    });
    // console.log(userExistes);

    if (userExistes) {
      throw new ConflictException();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        age,
        username,
      },
    });

    return this.generateJWT(user.username, user.id);
  }

  async signin({ username, password }: SigninParams) {
    const user = await this.prismaService.user.findUnique({
      where: { username },
      include: {
        UserSystemMenuItem: {
          include: {
            SystemMenuItem: true,
          },
        },
      },
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
      user: { ...user, password: null },
      backendTokens: {
        accessToken: await this.generateJWT(user.username, user.id),
        refreshToken: await this.generateRefreshJWT(user.username, user.id),
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
      },
    };
  }

  private async generateJWT(name: string, id: number) {
    return await jwt.sign({ name, id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
  }

  private async generateRefreshJWT(name: string, id: number) {
    return await jwt.sign({ name, id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });
  }

  async refreshToken(user: any) {
    return {
      accessToken: await this.generateJWT(user.name, user.id),
      refreshToken: await this.generateRefreshJWT(user.name, user.id),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };
  }
}

// 5:42
