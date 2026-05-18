'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSajuStore } from '@/store/sajuStore';
import { decodeShareUrl, copyShareUrl } from '@/utils/share';
import { CHEONGAN_ATTR } from '@/core/saju/ganji';
import HanjaGlyph from '@/components/common/HanjaGlyph';
import RomanceSection from '@/components/result/RomanceSection';
import Button from '@/components/common/Button';
import styles from './page.module.css';

export default function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { result, input, setInput, calculate, isCalculating, error } = useSajuStore();

  useEffect(() => {
    if (!result && !isCalculating) {
      const decoded = decodeShareUrl(searchParams.toString());
      if (decoded) {
        setInput(decoded);
        calculate();
      } else {
        router.replace('/');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isCalculating) {
    return (
      <div className={styles.loading}>
        <HanjaGlyph char="命" size="display" style={{ color: 'var(--color-primary)', opacity: 0.6 }} />
        <p>사주를 분석하고 있습니다…</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className={styles.loading}>
        <p className={styles.errorText}>{error || '결과를 불러올 수 없습니다.'}</p>
        <Button variant="secondary" onClick={() => router.replace('/')}>다시 입력하기</Button>
      </div>
    );
  }

  const dayGan = result.pillars.day.gan;
  const dayAttr = CHEONGAN_ATTR[dayGan];

  return (
    <>
      {/* 상단 바 */}
      <nav className={styles.subNav} aria-label="결과 내비게이션">
        <div className={styles.subNavInner}>
          <div className={styles.subNavLeft}>
            <span className={styles.dayGanLabel}>
              <HanjaGlyph char={dayGan} style={{ fontSize: '18px' }} />
              <span>{dayAttr.korName}({dayAttr.ohaeng}) 일간</span>
            </span>
          </div>
          <div className={styles.subNavLinks}>
            <span className={styles.navLink} style={{ cursor: 'default', color: 'var(--color-primary)', fontWeight: 500 }}>
              운명의 상대방
            </span>
          </div>
          <div className={styles.subNavRight}>
            {input && (
              <Button variant="utility"
                onClick={() => { copyShareUrl(input); alert('링크가 복사되었습니다.'); }}>
                공유
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* 메인 섹션 */}
      <section id="partner" className={`tile-light ${styles.section}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span aria-hidden="true" className={styles.sectionHanja}>緣</span>
            <div className={styles.sectionTitleGroup}>
              <h2 className={styles.sectionTitle}>운명의 상대방</h2>
              <p className={styles.sectionSub}>
                {result.input.birthYear}년 {result.input.birthMonth}월 {result.input.birthDay}일생
                {result.input.birthHour !== null ? ` ${result.input.birthHour}시` : ''} ·{' '}
                {result.input.gender}성의 사주팔자로 풀어본 나의 인연
              </p>
            </div>
          </div>
          <RomanceSection result={result} />
        </div>
      </section>
    </>
  );
}
