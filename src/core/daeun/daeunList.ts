import type { GanJi, DaeunItem, SaJuPillar } from '@/store/types';
import { CHEONGAN_ORDER, JIJI_ORDER } from '@/core/saju/ganji';

function getNextGanJi(gj: GanJi, isForward: boolean): GanJi {
  const ganIdx = CHEONGAN_ORDER.indexOf(gj.gan);
  const jiIdx  = JIJI_ORDER.indexOf(gj.ji);
  const step = isForward ? 1 : -1;
  return {
    gan: CHEONGAN_ORDER[((ganIdx + step) % 10 + 10) % 10],
    ji:  JIJI_ORDER[((jiIdx + step)  % 12 + 12) % 12],
  };
}

/** 전체 대운 목록 생성 (약 100세 이상 커버) */
export function buildDaeunList(
  pillars: SaJuPillar,
  startAge: number,
  isForward: boolean,
  count = 12
): DaeunItem[] {
  const list: DaeunItem[] = [];
  let current: GanJi = pillars.month; // 대운은 월주에서 순/역행

  for (let i = 0; i < count; i++) {
    current = getNextGanJi(current, isForward);
    const sa = startAge + i * 10;
    list.push({ startAge: sa, endAge: sa + 9, pillar: current });
  }
  return list;
}

/** 현재 대운 반환 */
export function getCurrentDaeun(
  daeunList: DaeunItem[], birthYear: number, currentYear: number
): DaeunItem | null {
  const currentAge = currentYear - birthYear;
  return daeunList.find(d => currentAge >= d.startAge && currentAge <= d.endAge) ?? null;
}
