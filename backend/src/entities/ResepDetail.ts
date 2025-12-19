import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Resep } from './Resep';
import { Obat } from './Obat';

@Entity('resep_detail')
export class ResepDetail {
  @PrimaryGeneratedColumn()
  idResepDetail!: number;

  @Column()
  idResep!: number;

  @Column()
  idObat!: number;

  @Column({ type: 'int' })
  jumlah!: number;

  @Column({ type: 'text' })
  aturanPakai!: string;

  @Column({ type: 'text', nullable: true })
  keterangan?: string;

  // Relations
  @ManyToOne(() => Resep, (resep) => resep.detail, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idResep' })
  resep!: Resep;

  @ManyToOne(() => Obat, (obat) => obat.resepDetail)
  @JoinColumn({ name: 'idObat' })
  obat!: Obat;
}
