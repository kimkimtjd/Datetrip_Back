// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /* 
    회원가입
    {
     "name": "홍길동",
     "email": "test@example.com",
     "password": "1234",
     "tel": "01012345678",
     "age": "29",
    "day": "2024-10-07"
    } 
  */
  @Post('signup')
  signup(
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
      tel: string;
      age: string;
      day: string;
    },
  ) {
    return this.authService.signup(body);
  }

  /* 
    로그인
    {
     "email": "test@example.com",
     "password": "1234",
    } 
  */
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }
}
