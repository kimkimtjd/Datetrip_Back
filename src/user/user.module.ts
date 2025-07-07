// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],

  // 요청을 어떻게 처리할지 Service에게 위임
  providers: [UserService],

  // 요청을 어떻게 처리할지 Service에게 위임
  controllers: [UserController],
})
export class UserModule {}
