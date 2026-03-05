export type DateLike = string | Date;

export function dateKey(d: DateLike): string {
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  // If it's already YYYY-MM-DD, keep it. Otherwise try to parse.
  const s = String(d);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const dt = new Date(s);
  return isNaN(dt.getTime()) ? s : dt.toISOString().slice(0, 10);
}

export function formatDate(d: DateLike): string {
  return dateKey(d);
}

export function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

export function groupBy<T extends Record<string, any>>(items: T[], key: keyof T) {
  const map = new Map<string, T[]>();
  for (const it of items) {
    const k = String(it[key] ?? "");
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(it);
  }
  return map;
}
