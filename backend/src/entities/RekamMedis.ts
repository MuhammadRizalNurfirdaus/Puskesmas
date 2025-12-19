import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User';
import { Kunjungan } from './Kunjungan';
import { Resep } from './Resep';

@Entity('rekam_medis')
export class RekamMedis {
  @PrimaryGeneratedColumn()
  idRekamMedis!: number;

  @Column()
  idKunjungan!: number;

  @Column()
  idDokter!: number;

  @Column({ type: 'text' })
  anamnesa!: string;

  @Column({ type: 'text' })
  pemeriksaanFisik!: string;

  @Column({ nullable: true })
  tekananDarah?: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  beratBadan?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  tinggiBadan?: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  suhuTubuh?: number;

  @Column({ type: 'text' })
  diagnosis!: string;

  @Column({ type: 'text', nullable: true })
  tindakan?: string;

  @Column({ type: 'text', nullable: true })
  catatan?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @OneToOne(() => Kunjungan, (kunjungan) => kunjungan.rekamMedis)
  @JoinColumn({ name: 'idKunjungan' })
  kunjungan!: Kunjungan;

  @ManyToOne(() => User, (user) => user.rekamMedis)
  @JoinColumn({ name: 'idDokter' })
  dokter!: User;

  @OneToMany(() => Resep, (resep) => resep.rekamMedis)
  resep!: Resep[];
}
