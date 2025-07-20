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
    ) { }

    // 여행 기록 생성
    async create(data: Partial<TravelData>, user: User): Promise<TravelData> {
        const newTravel = this.travelDataRepository.create({
            ...data,
            created_user: user,
        });
        return this.travelDataRepository.save(newTravel);
    }

    // 전체 여행 기록 조회 (optionally 사용자별로 필터링 가능)
    async findAll(
        id: string, // user id
        page: number,
        limit: number = 10,
      ): Promise<{ data: TravelData[]; total: number }> {
        const [data, total] = await this.travelDataRepository
          .createQueryBuilder('travel')
          .leftJoinAndSelect('travel.created_user', 'user')
          .leftJoinAndSelect('user.partner', 'partner')
          .where('user.id = :id OR user.partner_id = :id', { id })
          .orderBy('travel.id', 'DESC')
          .skip((page - 1) * limit)
          .take(limit)
          .getManyAndCount();
        return { data, total };
      }
      

    // 특정 여행 기록 조회
    async findByUuid(id: number): Promise<TravelData> {
        const travel = await this.travelDataRepository.findOne({
            where: { id },
            relations: ['created_user'],
        });
        if (!travel) throw new NotFoundException('여행 기록을 찾을 수 없습니다.');
        return travel;
    }

    // 여행 기록 수정
    async update(id: number, data: Partial<TravelData>): Promise<TravelData> {
        const travel = await this.findByUuid(id);
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
