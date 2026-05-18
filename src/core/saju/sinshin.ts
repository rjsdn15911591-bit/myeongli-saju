import type { CheonGan, ShinShin } from '@/store/types';
import { CHEONGAN_ATTR, GENERATING, OVERCOMING } from './ganji';

/** 십신(十神) 계산 — 일간(日干) 기준 */
export function getShinShin(dayGan: CheonGan, targetGan: CheonGan): ShinShin {
  const d = CHEONGAN_ATTR[dayGan];
  const t = CHEONGAN_ATTR[targetGan];
  const same = d.eumyang === t.eumyang;

  if (d.ohaeng === t.ohaeng) return same ? '비견' : '겁재';
  if (GENERATING[d.ohaeng] === t.ohaeng) return same ? '상관' : '식신';
  if (OVERCOMING[d.ohaeng] === t.ohaeng) return same ? '편재' : '정재';
  if (OVERCOMING[t.ohaeng] === d.ohaeng) return same ? '편관' : '정관';
  // 일간을 생하는 오행
  return same ? '편인' : '정인';
}

/** 십신 설명 */
export const SHINSHIN_DESC: Record<ShinShin, string> = {
  '비견': '같은 오행 동성 — 자아·형제·동료·경쟁 에너지',
  '겁재': '같은 오행 이성 — 강한 자아·투기·빼앗음',
  '식신': '일간이 생하는 이성 — 표현·식복·자녀·여유',
  '상관': '일간이 생하는 동성 — 재능·반골·언변·예술',
  '편재': '일간이 극하는 이성 — 유동재산·이재(利財)·사업',
  '정재': '일간이 극하는 동성 — 고정재산·안정·근면·배우자(남성)',
  '편관': '일간을 극하는 동성 — 권력·직업·스트레스·칠살(七殺)',
  '정관': '일간을 극하는 이성 — 명예·직위·법규·배우자(여성)',
  '편인': '일간을 생하는 동성 — 학문·종교·기술·편모',
  '정인': '일간을 생하는 이성 — 학습·어머니·인덕·도장(印)',
};
