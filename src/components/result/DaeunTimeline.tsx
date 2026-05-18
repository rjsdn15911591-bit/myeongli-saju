'use client';

import type { DaeunItem } from '@/store/types';
import { CHEONGAN_ATTR, JIJI_ATTR } from '@/core/saju/ganji';
import HanjaGlyph from '@/components/common/HanjaGlyph';
import styles from './DaeunTimeline.module.css';

const OHAENG_COLOR_MAP: Record<string, string> = {
  '木': 'var(--wood-primary)', '火': 'var(--fire-primary)',
  '土': 'var(--earth-primary)', '金': 'var(--metal-primary)', '水': 'var(--water-primary)',
};

interface Props {
  daeunList: DaeunItem[];
  startAge: number;
  birthYear: number;
  isForward: boolean;
  onSelect: (age: number) => void;
  selectedAge: number | null;
}

export default function DaeunTimeline({ daeunList, startAge, birthYear, isForward, onSelect, selectedAge }: Props) {
  const currentAge = new Date().getFullYear() - birthYear;

  return (
    <div className={styles.wrap}>
      <div className={styles.meta}>
        <span className={styles.metaItem}>기대운수 <strong>{startAge}세</strong></span>
        <span className={styles.metaItem}>{isForward ? '순행(順行)' : '역행(逆行)'}</span>
      </div>
      <div className={styles.timeline} role="list">
        {daeunList.map((d) => {
          const isActive = currentAge >= d.startAge && currentAge <= d.endAge;
          const isSelected = selectedAge === d.startAge;
          const ganOhaeng = CHEONGAN_ATTR[d.pillar.gan].ohaeng;
          const jiOhaeng  = JIJI_ATTR[d.pillar.ji].ohaeng;
          return (
            <button
              key={d.startAge}
              role="listitem"
              className={`${styles.item} ${isActive ? styles.active : ''} ${isSelected ? styles.selected : ''}`}
              onClick={() => onSelect(d.startAge)}
              aria-label={`${d.startAge}세~${d.endAge}세 대운 ${CHEONGAN_ATTR[d.pillar.gan].korName}${JIJI_ATTR[d.pillar.ji].korName}`}
              aria-pressed={isSelected}
            >
              <span className={styles.ageRange}>{d.startAge}~{d.endAge}세</span>
              <div className={styles.ganjiWrap}>
                <div className={styles.ganjiPair}>
                  <HanjaGlyph char={d.pillar.gan} style={{ fontSize: '28px', color: OHAENG_COLOR_MAP[ganOhaeng] }} />
                  <span className={styles.hanjiKor}>{CHEONGAN_ATTR[d.pillar.gan].korName}</span>
                </div>
                <div className={styles.ganjiPair}>
                  <HanjaGlyph char={d.pillar.ji} style={{ fontSize: '28px', color: OHAENG_COLOR_MAP[jiOhaeng] }} />
                  <span className={styles.hanjiKor}>{JIJI_ATTR[d.pillar.ji].korName}</span>
                </div>
              </div>
              {isActive && <span className={styles.nowBadge} aria-label="현재 대운">현재</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
