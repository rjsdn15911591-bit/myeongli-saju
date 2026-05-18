import type { CheonGan } from '@/store/types';
import { CHEONGAN_ATTR } from '@/core/saju/ganji';
import { getDaysToNearestJulgi } from '@/core/calendar/julgi';

function gregorianToJD(year: number, month: number, day: number, hour = 0): number {
  let y = year, m = month;
  if (m <= 2) { y--; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + hour / 24 + B - 1524.5;
}

/**
 * 대운 수(起大運數) 계산
 * @returns startAge (세), isForward (순행 여부), daysDiff (날수)
 */
export function calcDaeunStartAge(
  birthYear: number, birthMonth: number, birthDay: number, birthHour: number,
  yearGan: CheonGan, gender: '남' | '여'
): { startAge: number; isForward: boolean; daysDiff: number } {
  const ganYinYang = CHEONGAN_ATTR[yearGan].eumyang;
  const isForward =
    (gender === '남' && ganYinYang === '陽') ||
    (gender === '여' && ganYinYang === '陰');

  const birthJD = gregorianToJD(birthYear, birthMonth, birthDay, birthHour) + 9 / 24; // KST
  const { days } = getDaysToNearestJulgi(birthJD, isForward);
  const daysDiff = Math.round(days);

  const remainder = daysDiff % 3;
  const startAge = remainder === 0
    ? Math.floor(daysDiff / 3)
    : remainder === 1
      ? Math.floor(daysDiff / 3)
      : Math.ceil(daysDiff / 3);

  return { startAge, isForward, daysDiff };
}
