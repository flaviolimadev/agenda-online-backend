import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('agendas')
export class Agenda {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  user_id: number;

  @Column({ type: 'varchar', length: 100 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descricao: string | null;

  @Column({ type: 'date', nullable: true })
  data_inicio: Date | null;

  @Column({ type: 'date', nullable: true })
  data_termino: Date | null;

  @Column({ type: 'time', nullable: true })
  hora_inicio: string | null;

  @Column({ type: 'time', nullable: true })
  hora_termino: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  local: string | null;

  @Column({ type: 'int', default: 1 })
  status: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relacionamento com User
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
} 