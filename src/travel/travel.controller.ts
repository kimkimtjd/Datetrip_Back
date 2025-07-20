import {
    Controller,
    Get,
    Put,
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
    ) {
        const userId = req.user.id;
        return this.travelService.findAll(userId, Number(page), Number(limit));
    }

    // 상세
    @UseGuards(JwtAuthGuard)
    @Get('id')
    async getByUuid(@Param('uuid_id') id: number) {
        return this.travelService.findByUuid(id);
    }

}
