// 인증 관련 핵심 로직: 회원가입, 로그인(JWT 발급)
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // 회원가입: 비밀번호는 bcrypt로 암호화
  async signup(email: string, age: string, password: string): Promise<User> {
    const hashed = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, age, password: hashed });
    return this.userRepo.save(user);
  }

  // 로그인: 이메일 + 비밀번호 일치 확인 후 JWT 발급
  async login(email: string, password: string): Promise<{ access_token: string }> {
    const user = await this.userRepo.findOneBy({ email });

    // 유저가 없거나 비밀번호 불일치 시 예외
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // JWT payload 생성: sub = user.id, role = user.role
    const payload = { sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }
}
