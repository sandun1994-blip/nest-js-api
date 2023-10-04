import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from '../dtos/auth.dto';
import { RefreshGuard } from 'src/guards/refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post('/signin')
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  @UseGuards(RefreshGuard)
  @Post('/refresh')
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }
}
