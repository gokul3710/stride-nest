import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { userSigninDto } from '../dtos/user/auth/user-siginin.dto';
import { userGoogleSigninDto } from '../dtos/user/auth/user-google-signin.dto';
import { userGoogleSignupDto } from '../dtos/user/auth/user-google-signup.dto';
import { userSignupDto } from '../dtos/user/auth/user-signup.dto';
import {
  GoogleAuthGuard,
  getUserFromGoogleAuthToken,
} from 'src/guards/google-auth.guard';
import { userLoginDto } from '../dtos/user/auth/user-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @UsePipes(ValidationPipe)
  siginin(@Body() data: userSigninDto) {
    return this.authService.signin(data);
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() data: userLoginDto) {
    return this.authService.login(data);
  }

  @Post('signup')
  @UsePipes(ValidationPipe)
  siginup(@Body() data: userSignupDto) {
    return this.authService.signup(data);
  }

  @Post('signin/google')
  @UsePipes(ValidationPipe)
  sigininByGoogle(@Body() data: userGoogleSigninDto) {
    return this.authService.signinByGoogle(data);
  }

  @Post('signup/google')
  @UseGuards(GoogleAuthGuard)
  @UsePipes(ValidationPipe)
  siginUpByGoogle(@Request() request, @Body() data: userGoogleSignupDto) {
    const user = getUserFromGoogleAuthToken(request);
    if (typeof user === 'string') {
      return user;
    } else {
      user.phone = data.phone;
      user.password = data.password;
      user.gender = data.gender;
    }
    return this.authService.signupByGoogle(user);
  }
}
