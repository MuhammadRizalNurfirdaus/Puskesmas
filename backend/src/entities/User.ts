import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Pasien } from './Pasien';
import { Kunjungan } from './Kunjungan';
import { RekamMedis } from './RekamMedis';
import { Resep } from './Resep';

export enum UserRole {
  ADMIN = 'admin',
  PASIEN = 'pasien',
  PENDAFTARAN = 'pendaftaran',
  DOKTER = 'dokter',
  APOTEKER = 'apoteker',
  KEPALA_PUSKESMAS = 'kepala_puskesmas'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  idUser!: number;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ unique: true, nullable: true })
  googleId?: string;

  @Column()
  password!: string;

  @Column({ type: 'enum', enum: UserRole })
  role!: UserRole;

  @Column()
  namaLengkap!: string;

  @Column({ nullable: true })
  nip?: string;

  @Column({ nullable: true })
  noTelp?: string;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @OneToMany(() => Pasien, (pasien) => pasien.createdBy)
  pasienCreated!: Pasien[];

  @OneToMany(() => Kunjungan, (kunjungan) => kunjungan.petugasPendaftaran)
  kunjunganPendaftaran!: Kunjungan[];

  @OneToMany(() => RekamMedis, (rekamMedis) => rekamMedis.dokter)
  rekamMedis!: RekamMedis[];

  @OneToMany(() => Resep, (resep) => resep.dokter)
  resepDibuat!: Resep[];

  @OneToMany(() => Resep, (resep) => resep.apoteker)
  resepDilayani!: Resep[];
}
