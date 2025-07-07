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
    constructor(private userService: UserService) {}
  
    // 회원가입 (인증 없이 허용)
    @Post()
    async create(@Body() body: { name: string; age: string; password: string }) {
      return this.userService.create(body);
    }
  
    // 전체 유저 리스트 조회 (관리자만 접근 가능)
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Req() req: any) {
      if (req.user.role !== 'admin') {
        throw new ForbiddenException('Only admin can access user list');
      }
      return this.userService.findAll();
    }
  
    // 단일 유저 조회 (본인 또는 관리자만)
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: any,
    ) {
      const isAdmin = req.user.role === 'admin';
      const isOwner = req.user.userId === id;
  
      if (!isAdmin && !isOwner) {
        throw new ForbiddenException('Access denied');
      }
  
      return this.userService.findOne(id);
    }
  
    // 유저 정보 수정 (본인 또는 관리자만)
    @UseGuards(JwtAuthGuard)
    @Put(':id')
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
    @Delete(':id')
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
  