export interface User {
  idUser: number;
  username: string;
  namaLengkap: string;
  role: UserRole;
  nip?: string;
  noTelp?: string;
}

export enum UserRole {
  ADMIN = 'admin',
  PENDAFTARAN = 'pendaftaran',
  DOKTER = 'dokter',
  APOTEKER = 'apoteker',
  KEPALA_PUSKESMAS = 'kepala_puskesmas'
}

export interface Pasien {
  idPasien: number;
  noRekamMedis: string;
  nik: string;
  namaLengkap: string;
  tanggalLahir: string;
  jenisKelamin: 'L' | 'P';
  alamat: string;
  noTelp: string;
  statusPembayaran: 'umum' | 'bpjs';
  noBPJS?: string;
  golonganDarah?: string;
  riwayatAlergi?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Kunjungan {
  idKunjungan: number;
  noKunjungan: string;
  tanggalKunjungan: string;
  jamKunjungan: string;
  jenisKunjungan: 'rawat_jalan' | 'kontrol' | 'darurat';
  keluhan?: string;
  status: 'terdaftar' | 'pemeriksaan' | 'farmasi' | 'selesai' | 'batal';
  pasien: Pasien;
  petugasPendaftaran: User;
  rekamMedis?: RekamMedis;
  createdAt: string;
}

export interface RekamMedis {
  idRekamMedis: number;
  anamnesa: string;
  pemeriksaanFisik: string;
  tekananDarah?: string;
  beratBadan?: number;
  tinggiBadan?: number;
  suhuTubuh?: number;
  diagnosis: string;
  tindakan?: string;
  catatan?: string;
  kunjungan: Kunjungan;
  dokter: User;
  resep: Resep[];
  createdAt: string;
  updatedAt: string;
}

export interface Obat {
  idObat: number;
  kodeObat: string;
  namaObat: string;
  deskripsi?: string;
  satuan: string;
  stok: number;
  stokMinimal: number;
  harga?: number;
  isActive: boolean;
}

export interface Resep {
  idResep: number;
  noResep: string;
  tanggalResep: string;
  status: 'pending' | 'diproses' | 'selesai' | 'batal';
  catatan?: string;
  tanggalDilayani?: string;
  rekamMedis: RekamMedis;
  dokter: User;
  apoteker?: User;
  detail: ResepDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface ResepDetail {
  idResepDetail: number;
  jumlah: number;
  aturanPakai: string;
  keterangan?: string;
  obat: Obat;
}

export interface DashboardData {
  kunjunganHariIni: number;
  totalPasien: number;
  resepPending: number;
  obatStokRendah: number;
}

export interface LaporanKunjungan {
  data: Kunjungan[];
  statistik: {
    total: number;
    umum: number;
    bpjs: number;
  };
}
