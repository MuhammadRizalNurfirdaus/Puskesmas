import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Pasien } from './Pasien';
import { RekamMedis } from './RekamMedis';

export enum StatusKunjungan {
  TERDAFTAR = 'terdaftar',
  PEMERIKSAAN = 'pemeriksaan',
  FARMASI = 'farmasi',
  SELESAI = 'selesai',
  BATAL = 'batal'
}

export enum JenisKunjungan {
  RAWAT_JALAN = 'rawat_jalan',
  KONTROL = 'kontrol',
  DARURAT = 'darurat'
}

@Entity('kunjungan')
export class Kunjungan {
  @PrimaryGeneratedColumn()
  idKunjungan!: number;

  @Column({ unique: true })
  noKunjungan!: string;

  @Column({ type: 'date' })
  tanggalKunjungan!: Date;

  @Column({ type: 'time' })
  jamKunjungan!: string;

  @Column({ type: 'enum', enum: JenisKunjungan })
  jenisKunjungan!: JenisKunjungan;

  @Column({ type: 'text', nullable: true })
  keluhan?: string;

  @Column({ type: 'enum', enum: StatusKunjungan, default: StatusKunjungan.TERDAFTAR })
  status!: StatusKunjungan;

  @Column()
  idPasien!: number;

  @Column()
  idPetugasPendaftaran!: number;

  @CreateDateColumn()
  createdAt!: Date;

  // Relations
  @ManyToOne(() => Pasien, (pasien) => pasien.kunjungan)
  @JoinColumn({ name: 'idPasien' })
  pasien!: Pasien;

  @ManyToOne(() => User, (user) => user.kunjunganPendaftaran)
  @JoinColumn({ name: 'idPetugasPendaftaran' })
  petugasPendaftaran!: User;

  @OneToOne(() => RekamMedis, (rekamMedis) => rekamMedis.kunjungan)
  rekamMedis!: RekamMedis;
}
