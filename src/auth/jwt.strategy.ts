// JWT 토큰 검증 로직 정의
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // JWT 토큰을 HTTP 헤더에서 추출
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 서명 검증에 사용할 비밀 키
      secretOrKey: 'your_jwt_secret',
    });
  }

  // 유효한 토큰일 경우 실행됨 (req.user에 반환값이 들어감)
  async validate(payload: any) {
    // payload.sub → user.id, payload.role → user.role
    return { userId: payload.sub, role: payload.role };
  }
}
