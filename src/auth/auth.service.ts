// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // 회원가입
  async signup(body: {
    name: string;
    email: string;
    password: string;
    tel: string;
    age: string;
    day: string;
  }) {
    const { name, email, password, tel, age, day } = body;
  
    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // co_uuid는 자동 생성
    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      tel,
      age,
      day,
      co_uuid: uuidv4(),
    });
    const savedUser = await this.userRepository.save(newUser);
  
    const payload = {
      sub: savedUser.id,
      email: savedUser.email,
      co_uuid: savedUser.co_uuid,
      role: savedUser.role,
    };
  
    const accessToken = this.jwtService.sign(payload);
  
    // 비밀번호는 제외하고 반환
    const { password: _, ...userInfo } = savedUser;
  
    return {
      accessToken,
      user: userInfo,
    };
  }

  // 로그인
  async login({ email, password }: { email: string; password: string }) {
    const user = await this.userRepository.findOne({ where: { email } });
  
    if (!user) throw new UnauthorizedException('존재하지 않는 유저입니다.');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
  
    const payload = {
      sub: user.id,
      email: user.email,
      co_uuid: user.co_uuid,
      role: user.role, 
    };
  
    const accessToken = this.jwtService.sign(payload);
  
    // ✅ 비밀번호 제외하고 모든 유저 정보 반환
    const { password: _, ...userInfo } = user;
  
    return {
      accessToken,
      user: userInfo, // 👈 프론트에서 zustand에 저장하면 됨
    };
  }
}
