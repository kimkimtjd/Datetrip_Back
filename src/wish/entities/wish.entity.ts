// src/wish/wish.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid_id: string;

  @ManyToOne(() => User, (user) => user.id)
  created_user: User;

  @Column()
  date: string;

  @Column()
  address: string;

  @Column()
  lat: string;

  @Column()
  lng: string;
}
