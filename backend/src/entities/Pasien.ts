import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User';
import { Kunjungan } from './Kunjungan';

export enum JenisKelamin {
  LAKI_LAKI = 'L',
  PEREMPUAN = 'P'
}

export enum StatusPembayaran {
  UMUM = 'umum',
  BPJS = 'bpjs'
}

@Entity('pasien')
export class Pasien {
  @PrimaryGeneratedColumn()
  idPasien!: number;

  @Column({ unique: true })
  noRekamMedis!: string;

  @Column()
  nik!: string;

  @Column()
  namaLengkap!: string;

  @Column({ type: 'date' })
  tanggalLahir!: Date;

  @Column({ type: 'enum', enum: JenisKelamin })
  jenisKelamin!: JenisKelamin;

  @Column({ type: 'text' })
  alamat!: string;

  @Column()
  noTelp!: string;

  @Column({ type: 'enum', enum: StatusPembayaran })
  statusPembayaran!: StatusPembayaran;

  @Column({ nullable: true })
  noBPJS?: string;

  @Column({ nullable: true })
  golonganDarah?: string;

  @Column({ type: 'text', nullable: true })
  riwayatAlergi?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column()
  createdById!: number;

  // Relations
  @ManyToOne(() => User, (user) => user.pasienCreated)
  @JoinColumn({ name: 'createdById' })
  createdBy!: User;

  @OneToMany(() => Kunjungan, (kunjungan) => kunjungan.pasien)
  kunjungan!: Kunjungan[];
}
