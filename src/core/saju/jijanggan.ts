import type { JiJi, CheonGan } from '@/store/types';

interface JijangganEntry {
  yeogi: CheonGan;    // 여기(餘氣)
  junggi?: CheonGan;  // 중기(中氣)
  jeongi: CheonGan;   // 정기(正氣)
}

/** 지장간(支藏干) 테이블 */
export const JIJANGGAN: Record<JiJi, JijangganEntry> = {
  '子': { yeogi: '壬', jeongi: '癸' },
  '丑': { yeogi: '癸', junggi: '辛', jeongi: '己' },
  '寅': { yeogi: '戊', junggi: '丙', jeongi: '甲' },
  '卯': { yeogi: '甲', jeongi: '乙' },
  '辰': { yeogi: '乙', junggi: '癸', jeongi: '戊' },
  '巳': { yeogi: '戊', junggi: '庚', jeongi: '丙' },
  '午': { yeogi: '丙', junggi: '己', jeongi: '丁' },
  '未': { yeogi: '丁', junggi: '乙', jeongi: '己' },
  '申': { yeogi: '戊', junggi: '壬', jeongi: '庚' },
  '酉': { yeogi: '庚', jeongi: '辛' },
  '戌': { yeogi: '辛', junggi: '丁', jeongi: '戊' },
  '亥': { yeogi: '戊', junggi: '甲', jeongi: '壬' },
};

export function getJijanggan(ji: JiJi): CheonGan[] {
  const e = JIJANGGAN[ji];
  const result: CheonGan[] = [e.yeogi];
  if (e.junggi) result.push(e.junggi);
  result.push(e.jeongi);
  return result;
}
