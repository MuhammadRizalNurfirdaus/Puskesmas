import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User';
import { RekamMedis } from './RekamMedis';
import { ResepDetail } from './ResepDetail';

export enum StatusResep {
  PENDING = 'pending',
  DIPROSES = 'diproses',
  SELESAI = 'selesai',
  BATAL = 'batal'
}

@Entity('resep')
export class Resep {
  @PrimaryGeneratedColumn()
  idResep!: number;

  @Column({ unique: true })
  noResep!: string;

  @Column()
  idRekamMedis!: number;

  @Column()
  idDokter!: number;

  @Column({ nullable: true })
  idApoteker?: number;

  @Column({ type: 'date' })
  tanggalResep!: Date;

  @Column({ type: 'enum', enum: StatusResep, default: StatusResep.PENDING })
  status!: StatusResep;

  @Column({ type: 'text', nullable: true })
  catatan?: string;

  @Column({ type: 'datetime', nullable: true })
  tanggalDilayani?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => RekamMedis, (rekamMedis) => rekamMedis.resep)
  @JoinColumn({ name: 'idRekamMedis' })
  rekamMedis!: RekamMedis;

  @ManyToOne(() => User, (user) => user.resepDibuat)
  @JoinColumn({ name: 'idDokter' })
  dokter!: User;

  @ManyToOne(() => User, (user) => user.resepDilayani)
  @JoinColumn({ name: 'idApoteker' })
  apoteker?: User;

  @OneToMany(() => ResepDetail, (resepDetail) => resepDetail.resep, { cascade: true })
  detail!: ResepDetail[];
}
