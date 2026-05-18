import type { GanJi, CheonGan } from '@/store/types';
import { CHEONGAN_ORDER, JIJI_ORDER, MONTH_JIJI } from '@/core/saju/ganji';
import { getSajuYearAndMonthIndex } from '@/core/calendar/julgi';

/** 현재 월건(月建) 계산 */
export function getWolgeon(year: number, month: number, day: number): GanJi {
  const { sajuYear, monthJijiIndex } = getSajuYearAndMonthIndex(year, month, day, 12, 0);
  const yearGan: CheonGan = CHEONGAN_ORDER[((sajuYear - 1984) % 10 + 10) % 10];
  const BASE: Record<string, number> = {
    '甲': 2, '己': 2, '乙': 4, '庚': 4,
    '丙': 6, '辛': 6, '丁': 8, '壬': 8,
    '戊': 0, '癸': 0,
  };
  return {
    gan: CHEONGAN_ORDER[(BASE[yearGan] + monthJijiIndex) % 10],
    ji:  MONTH_JIJI[monthJijiIndex],
    void: 0,
  } as unknown as GanJi;
}

export function getWolgeonSimple(yearGan: CheonGan, monthJijiIndex: number): GanJi {
  const BASE: Record<string, number> = {
    '甲': 2, '己': 2, '乙': 4, '庚': 4,
    '丙': 6, '辛': 6, '丁': 8, '壬': 8,
    '戊': 0, '癸': 0,
  };
  return {
    gan: CHEONGAN_ORDER[(BASE[yearGan] + monthJijiIndex) % 10],
    ji:  MONTH_JIJI[monthJijiIndex],
  };
}
