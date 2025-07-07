// 회원가입과 로그인 API를 담당하는 컨트롤러
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST /auth/signup : 회원가입
  @Post('signup')
  signup(@Body() body: { email: string; age: string; password: string }) {
    return this.authService.signup(body.email, body.age, body.password);
  }

  // POST /auth/login : 로그인
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }
}
