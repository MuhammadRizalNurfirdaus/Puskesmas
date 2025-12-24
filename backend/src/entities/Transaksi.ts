import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pasien } from './Pasien';
import { Kunjungan } from './Kunjungan';
import { User } from './User';

export enum MetodePembayaran {
  TUNAI = 'tunai',
  TRANSFER = 'transfer',
  DEBIT = 'debit',
  BPJS = 'bpjs'
}

export enum StatusPembayaran {
  LUNAS = 'lunas',
  BELUM_DIBAYAR = 'belum_dibayar',
  DIBATALKAN = 'dibatalkan'
}

export enum StatusVerifikasi {
  MENUNGGU = 'menunggu',
  DISETUJUI = 'disetujui',
  DITOLAK = 'ditolak'
}

@Entity('transaksi')
export class Transaksi {
  @PrimaryGeneratedColumn()
  idTransaksi!: number;

  @Column({ unique: true })
  noTransaksi!: string;

  @Column()
  idKunjungan!: number;

  @Column()
  idPasien!: number;

  @Column({ type: 'date' })
  tanggalTransaksi!: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalBiaya!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  biayaPendaftaran!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  biayaPemeriksaan!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  biayaObat!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  biayaTindakan!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  diskon!: number;

  @Column({ type: 'enum', enum: MetodePembayaran })
  metodePembayaran!: MetodePembayaran;

  @Column({ type: 'enum', enum: StatusPembayaran, default: StatusPembayaran.BELUM_DIBAYAR })
  statusPembayaran!: StatusPembayaran;

  @Column({ type: 'enum', enum: StatusVerifikasi, default: StatusVerifikasi.MENUNGGU })
  statusVerifikasi!: StatusVerifikasi;

  @Column({ nullable: true })
  idKasir?: number;

  @Column({ nullable: true })
  idVerifikator?: number;

  @Column({ type: 'text', nullable: true })
  keterangan?: string;

  @Column({ type: 'text', nullable: true })
  catatanVerifikasi?: string;

  @Column({ type: 'datetime', nullable: true })
  tanggalVerifikasi?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => Kunjungan)
  @JoinColumn({ name: 'idKunjungan' })
  kunjungan!: Kunjungan;

  @ManyToOne(() => Pasien)
  @JoinColumn({ name: 'idPasien' })
  pasien!: Pasien;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'idKasir' })
  kasir?: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'idVerifikator' })
  verifikator?: User;
}
