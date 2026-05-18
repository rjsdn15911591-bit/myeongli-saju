import type { SajuInput } from '@/store/types';

export function encodeShareUrl(input: SajuInput): string {
  const params = new URLSearchParams({
    by: String(input.birthYear),
    bm: String(input.birthMonth).padStart(2, '0'),
    bd: String(input.birthDay).padStart(2, '0'),
    g:  input.gender === '남' ? 'm' : 'f',
    l:  input.isLunar ? '1' : '0',
  });
  if (input.birthHour !== null) {
    params.set('bh', String(input.birthHour).padStart(2, '0'));
  }
  if (input.birthMinute !== null) {
    params.set('bmin', String(input.birthMinute).padStart(2, '0'));
  }
  if (input.isLunar && input.isLeapMonth) {
    params.set('lp', '1');
  }
  return `/result/?${params.toString()}`;
}

export function decodeShareUrl(search: string): SajuInput | null {
  try {
    const params = new URLSearchParams(search);
    const by = parseInt(params.get('by') || '');
    const bm = parseInt(params.get('bm') || '');
    const bd = parseInt(params.get('bd') || '');
    const g  = params.get('g');
    if (isNaN(by) || isNaN(bm) || isNaN(bd) || !g) return null;
    const bh  = params.has('bh')   ? parseInt(params.get('bh')!) : null;
    const bmin = params.has('bmin') ? parseInt(params.get('bmin')!) : null;
    return {
      birthYear: by, birthMonth: bm, birthDay: bd,
      birthHour: bh, birthMinute: bmin,
      gender: g === 'm' ? '남' : '여',
      isLunar: params.get('l') === '1',
      isLeapMonth: params.get('lp') === '1',
    };
  } catch {
    return null;
  }
}

export function copyShareUrl(input: SajuInput): void {
  const url = `${window.location.origin}${encodeShareUrl(input)}`;
  navigator.clipboard.writeText(url).catch(() => {
    const el = document.createElement('textarea');
    el.value = url;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  });
}
