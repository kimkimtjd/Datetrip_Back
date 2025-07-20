// src/travel/travel.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TravelData } from './entities/travel.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TravelService {
  constructor(
    @InjectRepository(TravelData)
    private travelDataRepository: Repository<TravelData>,
  ) {}

  // 여행 기록 생성
  async create(data: Partial<TravelData>, user: User): Promise<TravelData> {
    const newTravel = this.travelDataRepository.create({
      ...data,
      created_user: user,
    });
    return this.travelDataRepository.save(newTravel);
  }

  // 전체 여행 기록 조회 (optionally 사용자별로 필터링 가능)
  async findAll(): Promise<TravelData[]> {
    return this.travelDataRepository.find({
      relations: ['created_user'], // 작성자 정보도 함께 불러옴
    });
  }

  // 특정 여행 기록 조회
  async findByUuid(uuid_id: string): Promise<TravelData> {
    const travel = await this.travelDataRepository.findOne({
      where: { uuid_id },
      relations: ['created_user'],
    });
    if (!travel) throw new NotFoundException('여행 기록을 찾을 수 없습니다.');
    return travel;
  }

  // 여행 기록 수정
  async update(uuid_id: string, data: Partial<TravelData>): Promise<TravelData> {
    const travel = await this.findByUuid(uuid_id);
    Object.assign(travel, data);
    return this.travelDataRepository.save(travel);
  }

  // 여행 기록 삭제
  async remove(id: number): Promise<void> {
    const result = await this.travelDataRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('여행 기록을 찾을 수 없습니다.');
    }
  }

  // 특정 유저의 여행 기록만 가져오기
  async findByUser(userId: number): Promise<TravelData[]> {
    return this.travelDataRepository.find({
      where: {
        created_user: { id: userId },
      },
      relations: ['created_user'],
    });
  }
}
