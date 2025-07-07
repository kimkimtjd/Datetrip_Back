// src/user/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  email: string;

  @Column()
  age: string;

  @Column()
  password: string;

  @Column({ default: 'user' }) // 'admin', 'user' 등 권한
  role: string;
}
