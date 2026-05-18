import type { OHaeng, SaJuPillar, OHaengDistribution, YongShin } from '@/store/types';
import { CHEONGAN_ATTR, JIJI_ATTR, GENERATING, OVERCOMING } from './ganji';
import { getJijanggan } from './jijanggan';

/** 원국 오행 분포 계산 (천간 4 + 지지 4, 지장간 가중치 포함) */
export function computeOhaeng(pillars: SaJuPillar): OHaengDistribution {
  const scores: Record<OHaeng, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };

  const gans = [pillars.year.gan, pillars.month.gan, pillars.day.gan];
  if (pillars.hour) gans.push(pillars.hour.gan);
  const jis = [pillars.year.ji, pillars.month.ji, pillars.day.ji];
  if (pillars.hour) jis.push(pillars.hour.ji);

  // 천간 각 1점
  for (const g of gans) scores[CHEONGAN_ATTR[g].ohaeng] += 1;
  // 지지 각 1점 (본기 기준)
  for (const j of jis) scores[JIJI_ATTR[j].ohaeng] += 1;

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const dist: OHaengDistribution = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
  for (const key of Object.keys(scores) as OHaeng[]) {
    dist[key] = Math.round((scores[key] / total) * 100);
  }
  return dist;
}

/** 신강(身强) / 신약(身弱) 판단 */
export function computeStrength(pillars: SaJuPillar): { isGangShin: boolean; score: number; text: string } {
  const dayGan = pillars.day.gan;
  const dayOhaeng = CHEONGAN_ATTR[dayGan].ohaeng;
  const monthJi = pillars.month.ji;

  let score = 0;

  // 월지 득령(得令) — 월지의 본기가 일간과 같거나 생하면 +3
  const monthJiOhaeng = JIJI_ATTR[monthJi].ohaeng;
  if (monthJiOhaeng === dayOhaeng) score += 3;
  else if (GENERATING[monthJiOhaeng] === dayOhaeng) score += 2;
  else if (OVERCOMING[monthJiOhaeng] === dayOhaeng) score -= 2;
  else if (OVERCOMING[dayOhaeng] === monthJiOhaeng) score -= 1;

  // 천간·지지에서 일간을 생조하는 요소 계산
  const allGans = [pillars.year.gan, pillars.month.gan];
  if (pillars.hour) allGans.push(pillars.hour.gan);
  const allJis = [pillars.year.ji, pillars.month.ji];
  if (pillars.hour) allJis.push(pillars.hour.ji);

  for (const g of allGans) {
    const ohaeng = CHEONGAN_ATTR[g].ohaeng;
    if (ohaeng === dayOhaeng) score += 1;
    else if (GENERATING[ohaeng] === dayOhaeng) score += 1;
    else if (OVERCOMING[ohaeng] === dayOhaeng) score -= 1;
    else if (OVERCOMING[dayOhaeng] === ohaeng) score -= 0.5;
  }

  for (const j of allJis) {
    const jzg = getJijanggan(j);
    for (const g of jzg) {
      const ohaeng = CHEONGAN_ATTR[g].ohaeng;
      if (ohaeng === dayOhaeng) score += 0.5;
      else if (GENERATING[ohaeng] === dayOhaeng) score += 0.3;
    }
  }

  const isGangShin = score >= 3;
  const text = isGangShin
    ? `일간 ${CHEONGAN_ATTR[dayGan].korName}${dayGan}이(가) 월지 득령하고 주변 생조가 충분하여 신강(身强)합니다.`
    : `일간 ${CHEONGAN_ATTR[dayGan].korName}${dayGan}이(가) 주변 극설이 많아 신약(身弱)합니다.`;

  return { isGangShin, score, text };
}

/** 용신(用神) 도출 — 억부법(抑扶法) */
export function computeYongShin(pillars: SaJuPillar): YongShin {
  const dayGan = pillars.day.gan;
  const dayOhaeng = CHEONGAN_ATTR[dayGan].ohaeng;
  const { isGangShin } = computeStrength(pillars);

  let yongShin: OHaeng;
  let huiShin: OHaeng;
  let giShin: OHaeng;
  let guShin: OHaeng;
  let hanShin: OHaeng;

  if (isGangShin) {
    // 신강 → 설기(泄氣)·극(克) 오행이 용신
    yongShin = GENERATING[dayOhaeng]; // 일간이 생하는 오행 (식상, 설기)
    huiShin  = OVERCOMING[dayOhaeng]; // 일간이 극하는 오행 (재성)
    giShin   = GENERATING[OVERCOMING[dayOhaeng] as OHaeng]; // 인성
    guShin   = dayOhaeng; // 비겁
    hanShin  = OVERCOMING[OVERCOMING[dayOhaeng] as OHaeng] as OHaeng; // 관성
  } else {
    // 신약 → 인성·비겁이 용신
    yongShin = GENERATING[OVERCOMING[dayOhaeng] as OHaeng] as OHaeng; // 인성 (일간을 생하는 오행)
    // 인성 = 일간을 생하는 오행 = OVERCOMING[x] === dayOhaeng를 만족하는 x
    const inseong = (Object.keys(GENERATING) as OHaeng[]).find(o => GENERATING[o] === dayOhaeng) || dayOhaeng;
    yongShin = inseong;
    huiShin  = dayOhaeng; // 비겁
    giShin   = OVERCOMING[dayOhaeng]; // 재성
    guShin   = GENERATING[dayOhaeng]; // 식상
    hanShin  = OVERCOMING[OVERCOMING[dayOhaeng] as OHaeng] as OHaeng;
  }

  return { yongShin, huiShin, giShin, guShin, hanShin, isGangShin };
}
