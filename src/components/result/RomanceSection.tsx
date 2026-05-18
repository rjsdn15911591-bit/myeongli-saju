'use client';

import { useState } from 'react';
import type { SajuResult, SpouseStats } from '@/store/types';
import styles from './RomanceSection.module.css';

interface Props { result: SajuResult }

const STAT_META = [
  { key: 'wealth'    as keyof SpouseStats, label: '재력',    textKey: 'wealthText'    as keyof SpouseStats },
  { key: 'ability'   as keyof SpouseStats, label: '능력',    textKey: 'abilityText'   as keyof SpouseStats },
  { key: 'affection' as keyof SpouseStats, label: '다정함',  textKey: 'affectionText' as keyof SpouseStats },
  { key: 'lifespan'  as keyof SpouseStats, label: '기대수명', textKey: 'lifespanText'  as keyof SpouseStats },
  { key: 'humor'     as keyof SpouseStats, label: '유머',    textKey: 'humorText'     as keyof SpouseStats },
];

// Pentagon radar chart
// axes: 재력(top), 능력(upper-right), 다정함(lower-right), 기대수명(lower-left), 유머(upper-left)
const ANGLES_DEG = [-90, -18, 54, 126, 198];
const cx = 130, cy = 128, maxR = 88, labelR = 114;

function toRad(deg: number) { return deg * Math.PI / 180; }
function ptStr(r: number, idx: number) {
  const a = toRad(ANGLES_DEG[idx]);
  return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
}
function polygonD(r: number) {
  return ANGLES_DEG.map((_, i) => (i === 0 ? 'M ' : 'L ') + ptStr(r, i)).join(' ') + ' Z';
}
function scorePoly(scores: number[]) {
  return scores.map((s, i) => (i === 0 ? 'M ' : 'L ') + ptStr(maxR * s / 100, i)).join(' ') + ' Z';
}

const LABEL_META: { label: string; anchor: 'middle' | 'start' | 'end'; dy: string }[] = [
  { label: '재력',    anchor: 'middle', dy: '-0.3em' },
  { label: '능력',    anchor: 'start',  dy: '0.35em' },
  { label: '다정함',  anchor: 'middle', dy: '1.1em'  },
  { label: '기대수명', anchor: 'middle', dy: '1.1em'  },
  { label: '유머',   anchor: 'end',    dy: '0.35em' },
];

function PentagonChart({ scores }: { scores: number[] }) {
  const grids = [0.2, 0.4, 0.6, 0.8, 1.0];
  return (
    <svg viewBox="0 0 260 258" className={styles.svg} aria-hidden="true">
      {/* grid rings */}
      {grids.map(f => (
        <path key={f} d={polygonD(maxR * f)}
          fill="none" stroke="var(--hairline)" strokeWidth={f === 1 ? 1.5 : 1} />
      ))}
      {/* axis spokes */}
      {ANGLES_DEG.map((_, i) => (
        <line key={i}
          x1={cx} y1={cy}
          x2={(cx + maxR * Math.cos(toRad(ANGLES_DEG[i]))).toFixed(2)}
          y2={(cy + maxR * Math.sin(toRad(ANGLES_DEG[i]))).toFixed(2)}
          stroke="var(--hairline)" strokeWidth="1" />
      ))}
      {/* score fill */}
      <path d={scorePoly(scores)}
        style={{ fill: 'color-mix(in srgb, var(--color-primary) 22%, transparent)',
                 stroke: 'var(--color-primary)', strokeWidth: 2, strokeLinejoin: 'round' }} />
      {/* score dots */}
      {scores.map((s, i) => {
        const a = toRad(ANGLES_DEG[i]);
        const r = maxR * s / 100;
        return (
          <circle key={i}
            cx={(cx + r * Math.cos(a)).toFixed(2)}
            cy={(cy + r * Math.sin(a)).toFixed(2)}
            r="4.5"
            style={{ fill: 'var(--color-primary)', stroke: '#fff', strokeWidth: 1.5 }} />
        );
      })}
      {/* axis labels */}
      {LABEL_META.map((m, i) => {
        const a = toRad(ANGLES_DEG[i]);
        return (
          <text key={i}
            x={(cx + labelR * Math.cos(a)).toFixed(2)}
            y={(cy + labelR * Math.sin(a)).toFixed(2)}
            textAnchor={m.anchor} dy={m.dy}
            fontSize="11.5" fontWeight="500"
            style={{ fill: 'var(--ink-muted-80)', fontFamily: 'var(--font-system, system-ui)' }}>
            {m.label}
          </text>
        );
      })}
    </svg>
  );
}

function ScoreBar({ value, label }: { value: number; label: string }) {
  const color = value >= 80 ? 'var(--color-primary)' : value >= 60 ? 'var(--color-primary)' : '#aaa';
  return (
    <div className={styles.scoreRow}>
      <span className={styles.scoreLabel}>{label}</span>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${value}%`, background: 'var(--color-primary)' }} />
      </div>
      <span className={styles.scoreNum} style={{ color }}>{value}</span>
    </div>
  );
}

export default function RomanceSection({ result }: Props) {
  const { spouseStats, input } = result;
  const scores = [spouseStats.wealth, spouseStats.ability, spouseStats.affection, spouseStats.lifespan, spouseStats.humor];
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const tetoColor = spouseStats.tetoEgen === '테토' ? '#e07a5f' : '#4a90d9';

  return (
    <div className={styles.wrap}>

      {/* 배지 행 */}
      <div className={styles.badgeRow}>
        <span className={styles.badge} style={{ background: tetoColor }}>
          {spouseStats.tetoEgen}형
        </span>
        <span className={styles.badge} style={{ background: 'var(--color-primary)' }}>
          {spouseStats.faceType}
        </span>
        <span className={styles.badgeOutline}>
          배우자 별성: {spouseStats.spouseOhaeng}
        </span>
        <span className={styles.badgeOutline}>
          평균 {avg}점
        </span>
      </div>

      {/* 메인 비주얼: 오각 그래프 + 점수 목록 */}
      <div className={styles.visualRow}>
        <div className={styles.chartWrap}>
          <PentagonChart scores={scores} />
        </div>
        <div className={styles.scoreList}>
          {STAT_META.map(m => (
            <ScoreBar key={m.key} value={spouseStats[m.key] as number} label={m.label} />
          ))}
        </div>
      </div>

      {/* 테토/에겐 설명 카드 */}
      <div className={styles.tetoCard}>
        <div className={styles.tetoCardHeader}>
          <span className={styles.tetoIcon} style={{ background: tetoColor }}>
            {spouseStats.tetoEgen}
          </span>
          <div>
            <p className={styles.tetoTitle}>
              {spouseStats.tetoEgen === '테토'
                ? '테토형 — 주도적·카리스마형'
                : '에겐형 — 다정함·배려형'}
            </p>
            <p className={styles.tetoSub}>
              {spouseStats.tetoEgen === '테토'
                ? '자신감 있고 결단력 강하며 관계에서 먼저 이끌어가는 성향'
                : '섬세하고 공감 능력이 뛰어나며 상대방을 세심하게 챙기는 성향'}
            </p>
          </div>
        </div>
      </div>

      {/* 특이사항 카드 */}
      <div className={styles.specialCard}>
        <p className={styles.specialTitle}>✦ 사주로 본 배우자의 특징</p>
        <p className={styles.specialBody}>{spouseStats.specialChars}</p>
      </div>

      {/* 항목별 해석 아코디언 */}
      <div className={styles.accordionList}>
        {STAT_META.map((m, i) => {
          const score = spouseStats[m.key] as number;
          const text = spouseStats[m.textKey] as string;
          const isOpen = openIdx === i;
          return (
            <div key={m.key} className={styles.accordionItem}>
              <button
                className={styles.accordionHead}
                onClick={() => setOpenIdx(isOpen ? null : i)}
                aria-expanded={isOpen}>
                <span className={styles.accordionLabel}>{m.label}</span>
                <span className={styles.accordionScore} style={{ color: 'var(--color-primary)' }}>
                  {score}점
                </span>
                <span className={styles.accordionChevron} aria-hidden="true">
                  {isOpen ? '▲' : '▼'}
                </span>
              </button>
              {isOpen && (
                <div className={styles.accordionBody}>
                  <p>{text}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA — 소개팅 부스 */}
      <div className={styles.ctaBox}>
        <p className={styles.ctaEmoji}>💫</p>
        <p className={styles.ctaTitle}>운명의 상대를 지금 바로 만날 수 있다면?</p>
        <p className={styles.ctaBody}>
          사주가 암시한 그 인연 — 지금 이 자리 소개팅 부스에서 기다리고 있을지도 몰라요.
        </p>
        <div className={styles.ctaArrow}>
          → 지금 바로 소개팅 부스로 Go!
        </div>
      </div>

      <p className={styles.disclaimer}>
        * 본 분석은 명리학적 경향을 재미 목적으로 제공합니다. 실제 인연은 당사자들의 노력과 선택이 가장 중요합니다.
      </p>
    </div>
  );
}
