import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ResepDetail } from './ResepDetail';

@Entity('obat')
export class Obat {
  @PrimaryGeneratedColumn()
  idObat!: number;

  @Column()
  kodeObat!: string;

  @Column()
  namaObat!: string;

  @Column({ type: 'text', nullable: true })
  deskripsi?: string;

  @Column()
  satuan!: string;

  @Column({ type: 'int', default: 0 })
  stok!: number;

  @Column({ type: 'int', default: 10 })
  stokMinimal!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  harga?: number;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @OneToMany(() => ResepDetail, (resepDetail) => resepDetail.obat)
  resepDetail!: ResepDetail[];
}
