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
              <p className={styles.heroEyebrow}>사주로 보는 나의 운명적 인연</p>
              <h1 className={styles.heroHeadline}>命理를 밝히다</h1>
              <p className={styles.heroSub}>
                생년월일시를 입력하면 사주로 풀어낸<br />
                미래 배우자의 팔자와 인연 운세를 알려드립니다.
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
          <h2 className={styles.featureTitle}><span aria-hidden="true">緣 </span>무엇을 알려드리나요</h2>
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
  { hanja: '財', title: '배우자 역량 풀이', desc: '재력·능력·다정함·기대수명·유머를 1~100점으로 수치화해 오각 그래프로 시각화합니다.' },
  { hanja: '性', title: '테토 / 에겐 판별', desc: '배우자가 주도적·카리스마형(테토)인지, 다정함·배려형(에겐)인지 사주로 분석합니다.' },
  { hanja: '相', title: '배우자 얼굴상', desc: '고양이상·강아지상·여우상·토끼상·호랑이상 중 배우자의 인상 유형을 알려드립니다.' },
  { hanja: '緣', title: '3개월 인연 운세', desc: '앞으로 3개월간 월별 좋은 인연을 만날 확률과 그 달의 연애 키워드를 제공합니다.' },
  { hanja: '星', title: '배우자 별성', desc: '관성·재성 등 사주 배우자 별성을 분석해 인연의 오행적 특성을 풀이합니다.' },
  { hanja: '合', title: '소개팅 부스 연결', desc: '사주가 암시한 그 인연, 지금 바로 소개팅 부스에서 만날 수 있을지도 모릅니다.' },
];
