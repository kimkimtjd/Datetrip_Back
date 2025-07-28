// src/user/user.controller.ts
import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

  // 회원가입 (인증 없이 허용)
  @Post()
  async create(@Body() body: { name: string; age: string; password: string }) {
    return this.userService.create(body);
  }

  // 전체 유저 리스트 조회 (관리자만 접근 가능)
  @UseGuards(JwtAuthGuard)
  @Get('all')
  async findAll(@Req() req: any) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Only admin can access user list');
    }
    return this.userService.findAll();
  }

  // 파트너 매칭
  @UseGuards(JwtAuthGuard)
  @Put('connect/:co_uuid')
  async connectPartner(@Param('co_uuid') co_uuid: string, @Req() req: any) {
    const myId = req.user.userId; // 로그인한 사용자 ID
    return this.userService.connectPartner(myId, co_uuid);
  }

  // 만난일수 변경
  @UseGuards(JwtAuthGuard)
  @Put('change/:day')
  async change_day(@Param('day') day: string, @Req() req: any) {
    const myId = req.user.userId; // 로그인한 사용자 ID
    return this.userService.changeDay(myId, day);
  }

  // 단일 유저 조회 (본인 또는 관리자만)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findOne(@Req() req: any) {
    const userId = req.user.id;
    return this.userService.findOne(userId);
  }

  // 유저 정보 수정 (본인 또는 관리자만)
  @UseGuards(JwtAuthGuard)
  @Put()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<{ name: string; age: string; password: string }>,
    @Req() req: any,
  ) {
    const isAdmin = req.user.role === 'admin';
    const isOwner = req.user.userId === id;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('Access denied');
    }

    return this.userService.update(id, body);
  }

  // 유저 삭제 (관리자만)
  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Only admin can delete users');
    }
    return this.userService.remove(id);
  }
}
