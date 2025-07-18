import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class TravelData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid_id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  date: string;

  // @Column()
  // address: string;

  // @Column()
  // lat: string;

  // @Column()
  // lng: string;

  @ManyToOne(() => User, (user) => user.travelRecords)
  created_user: User;
}
