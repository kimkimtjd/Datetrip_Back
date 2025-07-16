import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TravelData } from '../../travel/entities/travel.entity';
import { Wish } from '../../wish/entities/wish.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'user' }) // 👈 기본값은 일반 사용자
  role: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  tel: string;

  @Column()
  age: string;

  @Column()
  day: string;

  @Column({ nullable: true })
  profile_img: string;

  @Column({ unique: true })
  co_uuid: string;

  // 파트너 ID (자기참조)
  @Column({ nullable: true })
  partner_id: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'partner_id' })
  partner: User;

  @Column()
  password: string;

  @CreateDateColumn({ name: 'sign_in' })
  signIn: Date;

  @UpdateDateColumn({ name: 'login_in' })
  loginIn: Date;

  // 관계 설정 (1:N)
  @OneToMany(() => TravelData, (travel) => travel.created_user)
  travelRecords: TravelData[];

  @OneToMany(() => Wish, (wish) => wish.created_user)
  wishList: Wish[];
}
