import type { GanJi } from '@/store/types';
import { CHEONGAN_ORDER, JIJI_ORDER } from '@/core/saju/ganji';

/** 태세(太歲) 간지 — 갑자년 기준 1984 */
export function getTaeseGanJi(year: number): GanJi {
  return {
    gan: CHEONGAN_ORDER[((year - 1984) % 10 + 10) % 10],
    ji:  JIJI_ORDER[((year - 1984) % 12 + 12) % 12],
  };
}
