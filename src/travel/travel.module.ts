import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelService } from './travel.service';
import { TravelController } from './travel.controller';
import { TravelData } from './entities/travel.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TravelData]), // ✅ 여기 중요!
  ],
  controllers: [TravelController],
  providers: [TravelService],
})
export class TravelModule {}
