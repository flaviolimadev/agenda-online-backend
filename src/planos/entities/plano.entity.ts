import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('planos')
export class Plano {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  descricao: string | null;

  @Column({ type: 'int' })
  value: number;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @Column({ type: 'int' })
  tempo: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 