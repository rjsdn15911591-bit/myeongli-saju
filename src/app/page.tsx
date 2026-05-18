import HanjaGlyph from '@/components/common/HanjaGlyph';
import SajuInputForm from '@/components/input/SajuInputForm';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <>
      {/* 히어로 타일 */}
      <section className={`tile-light ${styles.hero}`}>
        <div className="container">
          <div className={styles.heroInner}>
            <HanjaGlyph char="命" size="tile" opacity={0.06} className={styles.heroWatermark} />
            <div className={styles.heroText}>
              <p className={styles.heroEyebrow}>전통 명리학 기반</p>
              <h1 className={styles.heroHeadline}>命理를 밝히다</h1>
              <p className={styles.heroSub}>
                생년월일시를 입력하면 사주팔자·오행·대운까지<br />
                정밀 명리 분석을 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 입력 타일 */}
      <section className={`tile-parchment ${styles.inputTile}`} id="input">
        <div className="container">
          <div className={styles.inputHeader}>
            <span aria-hidden="true" className={styles.inputHanja}>四柱</span>
            <h2 className={styles.inputTitle}>사주 입력</h2>
          </div>
          <SajuInputForm />
        </div>
      </section>

      {/* 특징 소개 타일 */}
      <section className={`tile-dark ${styles.featureTile}`}>
        <div className="container-wide">
          <h2 className={styles.featureTitle}><span aria-hidden="true">五行 </span>무엇을 분석하나요</h2>
          <div className={styles.featureGrid}>
            {FEATURES.map((f, i) => (
              <div key={i} className={styles.featureCard}>
                <HanjaGlyph char={f.hanja} size="icon" style={{ fontSize: '32px', color: 'var(--color-primary-on-dark)', opacity: 0.8 }} />
                <h3 className={styles.featureCardTitle}>{f.title}</h3>
                <p className={styles.featureCardDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const FEATURES = [
  { hanja: '命', title: '사주팔자 산출', desc: '만세력 기반 연·월·일·시주 4주 8자를 정밀하게 산출합니다. 절입 시각을 반영합니다.' },
  { hanja: '五', title: '오행 분석', desc: '木火土金水 오행 분포와 일간의 신강/신약, 용신·희신·기신을 도출합니다.' },
  { hanja: '大', title: '대운 분석', desc: '순행·역행 판별 후 10년 단위 대운 흐름을 타임라인으로 시각화합니다.' },
  { hanja: '歲', title: '세운·월운', desc: '현재 태세와 월건을 분석하고 원국과의 상호 관계를 해석합니다.' },
  { hanja: '性', title: '성격 해석', desc: '일간 오행과 십신 구성을 기반으로 기질·강점·약점을 서술합니다.' },
  { hanja: '業', title: '직업·재물', desc: '용신 오행을 기준으로 적성 직업군과 재물 운 방향을 안내합니다.' },
];
