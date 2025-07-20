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
  } from '@nestjs/common';import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TravelService } from './travel.service';

@Controller('travel')
export class TravelController {

  constructor(private travelService: TravelService) { }

  @UseGuards(JwtAuthGuard)
  @Get('uuid/:uuid_id')
  async getByUuid(@Param('uuid_id') uuid_id: string) {
    return this.travelService.findByUuid(uuid_id);
  }

}
