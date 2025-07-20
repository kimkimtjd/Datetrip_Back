import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  // 유효한 토큰일 경우 실행됨 → req.user에 반환값이 들어감
  async validate(payload: { sub: number; role: string; email: string }) {
   
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: ['partner'], // 필요 시 추가
    });

    if (!user) {
      throw new UnauthorizedException('유저 정보를 찾을 수 없습니다.');
    }

    return user; // req.user에 들어감
  }
}
