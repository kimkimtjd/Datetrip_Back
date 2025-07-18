// src/user/user.service.ts
import { Injectable, NotFoundException ,BadRequestException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository , Like } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    // const user = this.userRepo.create(data);
    const user = this.userRepo.create({
      ...data,
      day: new Date().toISOString().slice(0, 10), // 'YYYY-MM-DD' 형식
    });
    return this.userRepo.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, data);
    return this.userRepo.save(user);
  }

  async connectPartner(myId: number, partnerCoUuid: string) {
    const me = await this.userRepo.findOne({ where: { id: myId } });
    if (!me) {
      throw new NotFoundException('사용자 정보를 찾을 수 없습니다.');
    }
  
    const partner = await this.userRepo.findOne({ where: { co_uuid: Like(`${partnerCoUuid}%`) } });
    if (!partner) {
      throw new NotFoundException('상대방(co_uuid)을 찾을 수 없습니다.');
    }
  
    if (me.partner_id || partner.partner_id) {
      throw new BadRequestException('이미 파트너가 설정되어 있습니다.');
    }
  
    // 양방향 파트너 설정
    me.partner_id = partner.id;
    partner.partner_id = me.id;
  
    await this.userRepo.save([me, partner]);
  
    return { message: '파트너가 성공적으로 연결되었습니다.', me: me.id, partner: partner.id };
  }

  
  async remove(id: number): Promise<void> {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
