// JWT 토큰 검증 로직 정의
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor(
    private readonly configService: ConfigService
  ) {
     const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET 환경변수가 설정되어 있지 않습니다.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  // 유효한 토큰일 경우 실행됨 (req.user에 반환값이 들어감)
  async validate(payload: { sub: number; role: string; email: string }) {
    console.log('JWT payload:', payload);
    return {
      userId: payload.sub,
      role: payload.role,
      email: payload.email,
    };
  }
}
