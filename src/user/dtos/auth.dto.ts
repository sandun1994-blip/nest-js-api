import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  isNotEmpty,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  isActive: number;

  @IsString()
  @IsNotEmpty()
  staffNo: number;

  @IsString()
  @IsNotEmpty()
  age: number;

  // @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
  //   message: 'phone must be a valid phone number',
  // })
  // phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;
}

export class SigninDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(5)
  password: string;
}
