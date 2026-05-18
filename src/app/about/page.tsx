import HanjaGlyph from '@/components/common/HanjaGlyph';
import styles from './page.module.css';

export default function AboutPage() {
  return (
    <>
      <section className={`tile-light ${styles.hero}`}>
        <div className="container">
          <h1 className={styles.title}>서비스 소개</h1>
          <p className={styles.lead}>
            命理 사주는 전통 명리학의 깊이를 현대 사용자 경험으로 번역합니다.
          </p>
        </div>
      </section>
      <section className={`tile-parchment ${styles.body}`}>
        <div className="container">
          <div className={styles.grid}>
            {ABOUT_ITEMS.map((item, i) => (
              <div key={i} className={styles.item}>
                <HanjaGlyph char={item.hanja} style={{ fontSize: '36px', color: 'var(--color-primary)', opacity: 0.7 }} />
                <h2 className={styles.itemTitle}>{item.title}</h2>
                <p className={styles.itemDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div className={styles.note}>
            <p>모든 계산은 브라우저에서 실행되며 개인정보를 서버에 저장하지 않습니다.</p>
            <p>만세력 절기 데이터는 천문 알고리즘(Jean Meeus, "Astronomical Algorithms")을 기반으로 산출됩니다.</p>
          </div>
        </div>
      </section>
    </>
  );
}

const ABOUT_ITEMS = [
  { hanja: '精', title: '정확성', desc: '절입(節入) 시각을 반영한 정밀 만세력으로 사주팔자를 산출합니다. 천문 알고리즘 기반의 분 단위 절기 계산을 적용합니다.' },
  { hanja: '完', title: '완결성', desc: '원국 분석부터 오행·용신 도출, 대운·세운·월운까지 하나의 흐름으로 종합 명리 해석을 제공합니다.' },
  { hanja: '美', title: '가독성', desc: '한자와 한글을 디자인 원칙에 따라 병기하여 전문성과 접근성을 동시에 달성합니다.' },
  { hanja: '私', title: '개인정보', desc: '생년월일 등 모든 계산이 브라우저에서만 실행됩니다. 서버에 어떤 데이터도 저장하지 않습니다.' },
];
