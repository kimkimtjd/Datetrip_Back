// JWT 인증이 필요한 라우트에 붙이는 인증 가드
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// 'jwt'는 passport-jwt에서 정의한 기본 전략 이름
export class JwtAuthGuard extends AuthGuard('jwt') {}
