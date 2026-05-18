'use client';

import { useState } from 'react';
import type { GanJi, SaJuPillar } from '@/store/types';
import { CHEONGAN_ATTR, JIJI_ATTR } from '@/core/saju/ganji';
import { getTaeseGanJi } from '@/core/seun/taeseGanji';
import HanjaGlyph from '@/components/common/HanjaGlyph';
import styles from './SeunPanel.module.css';

interface Props {
  currentYear: GanJi;
  currentMonth: GanJi;
  pillars: SaJuPillar;
  birthYear: number;
}

function GanJiBlock({ ganJi, label }: { ganJi: GanJi; label: string }) {
  const ga = CHEONGAN_ATTR[ganJi.gan];
  const ja = JIJI_ATTR[ganJi.ji];
  return (
    <div className={styles.block}>
      <p className={styles.blockLabel}>{label}</p>
      <div className={styles.blockPair}>
        <div className={styles.blockGlyph}>
          <HanjaGlyph char={ganJi.gan} style={{ fontSize: '40px' }} />
          <span className={styles.blockKor}>{ga.korName}</span>
        </div>
        <div className={styles.blockGlyph}>
          <HanjaGlyph char={ganJi.ji} style={{ fontSize: '40px' }} />
          <span className={styles.blockKor}>{ja.korName}</span>
        </div>
      </div>
      <div className={styles.blockMeta}>
        <span>{ga.ohaeng} {ga.eumyang}</span>
        <span>·</span>
        <span>{ja.ohaeng} {ja.season}</span>
      </div>
    </div>
  );
}

export default function SeunPanel({ currentYear, currentMonth, pillars, birthYear }: Props) {
  const currentAge = new Date().getFullYear() - birthYear;
  const [seunYear, setSeunYear] = useState(new Date().getFullYear());
  const seunGanJi = getTaeseGanJi(seunYear);

  return (
    <div className={styles.wrap}>
      {/* 세운 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}><span aria-hidden="true">歲運</span> 세운</h3>
          <div className={styles.yearNav}>
            <button className={styles.navBtn} onClick={() => setSeunYear(v => v - 1)} aria-label="이전 연도">‹</button>
            <span className={styles.yearDisplay}>{seunYear}년</span>
            <button className={styles.navBtn} onClick={() => setSeunYear(v => v + 1)} aria-label="다음 연도">›</button>
          </div>
        </div>
        <div className={styles.ganJiRow}>
          <GanJiBlock ganJi={seunGanJi} label={`${seunYear}년 태세`} />
        </div>
        <p className={styles.desc}>
          {seunYear}년 ({seunYear - birthYear}세)의 태세(太歲)는 {CHEONGAN_ATTR[seunGanJi.gan].korName}
          {seunGanJi.gan}{JIJI_ATTR[seunGanJi.ji].korName}{seunGanJi.ji}입니다.
          원국 일간의 {CHEONGAN_ATTR[pillars.day.gan].ohaeng}과의 상호 작용에 따라 해당 연도의 흐름이 영향을 받습니다.
        </p>
      </div>

      {/* 월운 */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}><span aria-hidden="true">月運</span> 월운</h3>
        <div className={styles.ganJiRow}>
          <GanJiBlock ganJi={currentMonth} label="현재 월건" />
        </div>
        <p className={styles.desc}>
          현재 월건(月建)은 {CHEONGAN_ATTR[currentMonth.gan].korName}{currentMonth.gan}
          {JIJI_ATTR[currentMonth.ji].korName}{currentMonth.ji}입니다.
          월운은 세운의 흐름 안에서 월별 기운의 변화를 나타냅니다.
        </p>
      </div>
    </div>
  );
}
