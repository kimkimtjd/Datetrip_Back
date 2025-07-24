import {
    Controller,
    Get,
    Patch,
    Post,
    Delete,
    Query,
    Param,
    Body,
    UseGuards,
    Req,
    ForbiddenException,
    ParseIntPipe,
} from '@nestjs/common'; import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TravelService } from './travel.service';

@Controller('travel')
export class TravelController {

    constructor(private travelService: TravelService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createTravel(@Body() data: any, @Req() req) {
        const user = req.user; // JwtStrategy에서 넣어준 사용자 정보
        return this.travelService.create(data, user);
    }

    // 내가 작성한 게시물
    @UseGuards(JwtAuthGuard)
    @Get()
    async getTravelList(
        @Req() req,
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('month') month?: string,
    ) {
        const userId = req.user.id;
        return this.travelService.findAll(userId, Number(page), Number(limit),month);
    }

    // 상세
    @UseGuards(JwtAuthGuard)
    @Get('id')
    async getByUuid(@Param('uuid_id') id: number) {
        return this.travelService.findByUuid(id);
    }

    // 여행 기록 수정
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: Partial<any>, // 실제 DTO 타입으로 교체 권장
    ) {
        return this.travelService.update(id, data);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
        const userId = req.user.id;
        const travel = await this.travelService.findByUuid(id);

        // 작성자 또는 파트너만 삭제 가능
        if (travel.created_user.id !== userId && travel.created_user.partner?.id !== userId) {
            throw new ForbiddenException('삭제 권한이 없습니다.');
        }

        await this.travelService.remove(id);
        return { message: '삭제되었습니다.' };
    }
}
