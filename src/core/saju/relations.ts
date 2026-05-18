import type { CheonGan, JiJi, OHaeng, SaJuPillar, RelationResult } from '@/store/types';

export const CHEONGAN_HAP: [CheonGan, CheonGan, OHaeng][] = [
  ['甲', '己', '土'], ['乙', '庚', '金'], ['丙', '辛', '水'],
  ['丁', '壬', '木'], ['戊', '癸', '火'],
];

export const JIJI_SAMHAP: [JiJi, JiJi, JiJi, OHaeng][] = [
  ['寅', '午', '戌', '火'], ['亥', '卯', '未', '木'],
  ['申', '子', '辰', '水'], ['巳', '酉', '丑', '金'],
];

export const JIJI_YUKHAP: [JiJi, JiJi, OHaeng][] = [
  ['子', '丑', '土'], ['寅', '亥', '木'], ['卯', '戌', '火'],
  ['辰', '酉', '金'], ['巳', '申', '水'], ['午', '未', '土'],
];

export const JIJI_BANGHAP: [JiJi, JiJi, JiJi, OHaeng][] = [
  ['寅', '卯', '辰', '木'], ['巳', '午', '未', '火'],
  ['申', '酉', '戌', '金'], ['亥', '子', '丑', '水'],
];

export const JIJI_CHUNG: [JiJi, JiJi][] = [
  ['子', '午'], ['丑', '未'], ['寅', '申'],
  ['卯', '酉'], ['辰', '戌'], ['巳', '亥'],
];

export const JIJI_HYEONG: [JiJi, JiJi][] = [
  ['寅', '巳'], ['巳', '申'], ['申', '寅'],
  ['丑', '戌'], ['戌', '未'], ['未', '丑'],
  ['子', '卯'], ['卯', '子'],
];

export const JIJI_PA: [JiJi, JiJi][] = [
  ['子', '酉'], ['丑', '辰'], ['寅', '亥'],
  ['卯', '午'], ['申', '巳'], ['未', '戌'],
];

export const JIJI_HAE: [JiJi, JiJi][] = [
  ['子', '未'], ['丑', '午'], ['寅', '巳'],
  ['卯', '辰'], ['申', '亥'], ['酉', '戌'],
];

/** 사주 원국 합·충·형·방합 감지 */
export function detectRelations(pillars: SaJuPillar): RelationResult[] {
  const results: RelationResult[] = [];
  const gans: CheonGan[] = [pillars.year.gan, pillars.month.gan, pillars.day.gan];
  if (pillars.hour) gans.push(pillars.hour.gan);
  const jis: JiJi[] = [pillars.year.ji, pillars.month.ji, pillars.day.ji];
  if (pillars.hour) jis.push(pillars.hour.ji);

  // 천간합
  for (const [g1, g2, ohaeng] of CHEONGAN_HAP) {
    if (gans.includes(g1) && gans.includes(g2)) {
      results.push({ type: '천간합', elements: [g1, g2], resultOhaeng: ohaeng,
        description: `${g1}${g2} 천간합 → ${ohaeng} 화(化)` });
    }
  }

  // 지지 육합
  for (const [j1, j2, ohaeng] of JIJI_YUKHAP) {
    if (jis.includes(j1) && jis.includes(j2)) {
      results.push({ type: '육합', elements: [j1, j2], resultOhaeng: ohaeng,
        description: `${j1}${j2} 육합 → ${ohaeng}` });
    }
  }

  // 지지 삼합
  for (const [j1, j2, j3, ohaeng] of JIJI_SAMHAP) {
    const count = [j1, j2, j3].filter(j => jis.includes(j)).length;
    if (count >= 2) {
      const present = [j1, j2, j3].filter(j => jis.includes(j));
      results.push({ type: '삼합', elements: present, resultOhaeng: ohaeng,
        description: `${present.join('')} ${count === 3 ? '삼합' : '반합'} → ${ohaeng}` });
    }
  }

  // 방합
  for (const [j1, j2, j3, ohaeng] of JIJI_BANGHAP) {
    const count = [j1, j2, j3].filter(j => jis.includes(j)).length;
    if (count >= 2) {
      const present = [j1, j2, j3].filter(j => jis.includes(j));
      results.push({ type: '방합', elements: present, resultOhaeng: ohaeng,
        description: `${present.join('')} 방합 → ${ohaeng} 강화` });
    }
  }

  // 지지 충
  for (const [j1, j2] of JIJI_CHUNG) {
    if (jis.includes(j1) && jis.includes(j2)) {
      results.push({ type: '충', elements: [j1, j2],
        description: `${j1}${j2} 충(沖)` });
    }
  }

  // 지지 형
  for (const [j1, j2] of JIJI_HYEONG) {
    if (jis.includes(j1) && jis.includes(j2)) {
      results.push({ type: '형', elements: [j1, j2],
        description: `${j1}${j2} 형(刑)` });
    }
  }

  // 지지 파
  for (const [j1, j2] of JIJI_PA) {
    if (jis.includes(j1) && jis.includes(j2)) {
      results.push({ type: '파', elements: [j1, j2],
        description: `${j1}${j2} 파(破)` });
    }
  }

  // 지지 해
  for (const [j1, j2] of JIJI_HAE) {
    if (jis.includes(j1) && jis.includes(j2)) {
      results.push({ type: '해', elements: [j1, j2],
        description: `${j1}${j2} 해(害)` });
    }
  }

  return results;
}
