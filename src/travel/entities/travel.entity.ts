import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class TravelData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  date: string;

  @Column({ nullable: true })  // ✅ 주소 null 허용
  address: string;

  @Column({ nullable: true })  // ✅ 위도 null 허용
  lat: string;

  @Column({ nullable: true })  // ✅ 경도 null 허용
  lng: string;

  @ManyToOne(() => User, (user) => user.travelRecords)
  created_user: User;
}
