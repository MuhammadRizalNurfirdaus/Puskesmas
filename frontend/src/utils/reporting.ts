export type KunjunganLike = {
  tanggalKunjungan?: string;
  pasien?: { statusPembayaran?: string };
};

export function toISODateOnly(value: string | Date): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function getDateRangeInclusive(startISO: string, endISO: string): string[] {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const out: string[] = [];
  let cur = new Date(start);

  while (cur <= end) {
    out.push(toISODateOnly(cur));
    cur = addDays(cur, 1);
  }
  return out;
}

export function groupKunjunganPerDay(
  kunjungan: KunjunganLike[],
  startISO: string,
  endISO: string
): Array<{ date: string; total: number; umum: number; bpjs: number }> {
  const bucket = new Map<string, { total: number; umum: number; bpjs: number }>();

  for (const k of kunjungan) {
    if (!k.tanggalKunjungan) continue;
    const date = toISODateOnly(k.tanggalKunjungan);
    const prev = bucket.get(date) ?? { total: 0, umum: 0, bpjs: 0 };
    prev.total += 1;

    const status = (k.pasien?.statusPembayaran ?? '').toLowerCase();
    if (status === 'umum') prev.umum += 1;
    if (status === 'bpjs') prev.bpjs += 1;

    bucket.set(date, prev);
  }

  return getDateRangeInclusive(startISO, endISO).map((date) => {
    const v = bucket.get(date) ?? { total: 0, umum: 0, bpjs: 0 };
    return { date, ...v };
  });
}

export function formatIDShortDate(isoDate: string): string {
  // isoDate: YYYY-MM-DD
  const [, m, d] = isoDate.split('-');
  return `${d}/${m}`;
}
