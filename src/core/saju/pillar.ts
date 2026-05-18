import type { CheonGan, JiJi, GanJi, SaJuPillar } from '@/store/types';
import { CHEONGAN_ORDER, JIJI_ORDER, MONTH_JIJI, CHEONGAN_ATTR } from './ganji';
import { getSajuYearAndMonthIndex } from '@/core/calendar/julgi';
import { lunarToSolar } from '@/core/calendar/solarLunar';

/** 연주(年柱) 천간 — 기준: 甲子年=1984 */
export function getYearGan(sajuYear: number): CheonGan {
  return CHEONGAN_ORDER[((sajuYear - 1984) % 10 + 10) % 10];
}

/** 연주(年柱) 지지 */
export function getYearJi(sajuYear: number): JiJi {
  return JIJI_ORDER[((sajuYear - 1984) % 12 + 12) % 12];
}

/** 월주(月柱) 천간 — 오호둔월법(五虎遁月法) */
export function getMonthGan(yearGan: CheonGan, monthJijiIndex: number): CheonGan {
  // monthJijiIndex: 0=寅, 1=卯, ... 11=丑
  const BASE: Record<string, number> = {
    '甲': 2, '己': 2,
    '乙': 4, '庚': 4,
    '丙': 6, '辛': 6,
    '丁': 8, '壬': 8,
    '戊': 0, '癸': 0,
  };
  return CHEONGAN_ORDER[(BASE[yearGan] + monthJijiIndex) % 10];
}

/** 일주(日柱) 간지 — 기준: 1900-01-01 = 甲戌 */
export function getDayGanJi(year: number, month: number, day: number): GanJi {
  let yy = year, mm = month;
  if (mm <= 2) { yy--; mm += 12; }
  const A = Math.floor(yy / 100);
  const B = 2 - A + Math.floor(A / 4);
  const jd = Math.floor(365.25 * (yy + 4716)) + Math.floor(30.6001 * (mm + 1)) + day + B - 1524.5;

  // 1900-01-01 JD = 2415020.5
  const base = 2415020.5;
  const diff = Math.round(jd - base);

  // 1900-01-01 = 甲戌 → 天干 idx=0(甲), 地支 idx=10(戌)
  const ganIdx = ((diff + 0) % 10 + 10) % 10;
  const jiIdx  = ((diff + 10) % 12 + 12) % 12;

  return { gan: CHEONGAN_ORDER[ganIdx], ji: JIJI_ORDER[jiIdx] };
}

/** 시주(時柱) 지지 */
export function getHourJi(hour: number, minute: number): JiJi {
  const totalMin = hour * 60 + minute;
  const BOUNDARIES: { ji: JiJi; start: number }[] = [
    { ji: '子', start: 1410 }, // 23:30
    { ji: '丑', start: 90  },
    { ji: '寅', start: 210 },
    { ji: '卯', start: 330 },
    { ji: '辰', start: 450 },
    { ji: '巳', start: 570 },
    { ji: '午', start: 690 },
    { ji: '未', start: 810 },
    { ji: '申', start: 930 },
    { ji: '酉', start: 1050 },
    { ji: '戌', start: 1170 },
    { ji: '亥', start: 1290 },
  ];
  const adj = totalMin < 90 ? totalMin + 1440 : totalMin;
  for (let i = BOUNDARIES.length - 1; i >= 0; i--) {
    if (adj >= BOUNDARIES[i].start) return BOUNDARIES[i].ji;
  }
  return '亥';
}

/** 시주(時柱) 천간 — 오자둔시법(五子遁時法) */
export function getHourGan(dayGan: CheonGan, hourJi: JiJi): CheonGan {
  const BASE: Record<string, number> = {
    '甲': 0, '己': 0,
    '乙': 2, '庚': 2,
    '丙': 4, '辛': 4,
    '丁': 6, '壬': 6,
    '戊': 8, '癸': 8,
  };
  const jiIdx = JIJI_ORDER.indexOf(hourJi);
  return CHEONGAN_ORDER[(BASE[dayGan] + jiIdx) % 10];
}

interface PillarInput {
  year: number; month: number; day: number;
  hour: number | null; minute: number | null;
  isLunar: boolean; isLeapMonth: boolean;
}

/** 사주팔자(四柱八字) 산출 */
export function computePillars(input: PillarInput): SaJuPillar {
  let { year, month, day } = input;
  const hour = input.hour ?? 0;
  const minute = input.minute ?? 0;

  // 음력 → 양력 변환
  if (input.isLunar) {
    const solar = lunarToSolar(year, month, day, input.isLeapMonth);
    year = solar.year; month = solar.month; day = solar.day;
  }

  // 연주·월주 계산 (절기 기준)
  const { sajuYear, monthJijiIndex } = getSajuYearAndMonthIndex(year, month, day, hour, minute);

  const yearGan = getYearGan(sajuYear);
  const yearJi  = getYearJi(sajuYear);
  const monthJi = MONTH_JIJI[monthJijiIndex];
  const monthGan = getMonthGan(yearGan, monthJijiIndex);

  const dayGanJi = getDayGanJi(year, month, day);

  let hourGanJi: GanJi | null = null;
  if (input.hour !== null) {
    const hourJi = getHourJi(hour, minute);
    const hourGan = getHourGan(dayGanJi.gan, hourJi);
    hourGanJi = { gan: hourGan, ji: hourJi };
  }

  return {
    year:  { gan: yearGan,  ji: yearJi  },
    month: { gan: monthGan, ji: monthJi },
    day:   dayGanJi,
    hour:  hourGanJi,
  };
}

/** 일간 기준 대운 순역 판단 */
export function isForwardDaeun(yearGan: CheonGan, gender: '남' | '여'): boolean {
  const isYang = CHEONGAN_ATTR[yearGan].eumyang === '陽';
  return (gender === '남' && isYang) || (gender === '여' && !isYang);
}
