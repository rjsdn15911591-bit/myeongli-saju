import HanjaGlyph from '@/components/common/HanjaGlyph';
import styles from './page.module.css';

const TERMS = [
  { hanja: '天干', kor: '천간', desc: '甲乙丙丁戊己庚辛壬癸의 10가지. 하늘의 기운을 나타내며 오행과 음양으로 분류됩니다.' },
  { hanja: '地支', kor: '지지', desc: '子丑寅卯辰巳午未申酉戌亥의 12가지. 땅의 기운을 나타내며 계절과 시간을 구분합니다.' },
  { hanja: '五行', kor: '오행', desc: '木火土金水 다섯 기운. 만물을 구성하는 기본 원리로 상생(相生)·상극(相克) 관계를 이룹니다.' },
  { hanja: '四柱', kor: '사주', desc: '연주(年柱)·월주(月柱)·일주(日柱)·시주(時柱) 4개의 기둥. 여기에 천간·지지 각 1글자씩 총 8자를 팔자라 합니다.' },
  { hanja: '日干', kor: '일간', desc: '일주(日柱)의 천간. 사주 분석에서 자기 자신을 나타내는 기준입니다.' },
  { hanja: '十神', kor: '십신', desc: '일간을 기준으로 나머지 7자와의 관계를 비견·겁재·식신·상관·편재·정재·편관·정관·편인·정인 10가지로 분류합니다.' },
  { hanja: '用神', kor: '용신', desc: '사주의 불균형을 보완하는 핵심 오행. 억부법·조후법 등으로 도출하며 생활 방향에 활용합니다.' },
  { hanja: '大運', kor: '대운', desc: '10년 단위로 변화하는 운의 흐름. 기대운수(起大運數)부터 시작하여 순행 또는 역행합니다.' },
  { hanja: '歲運', kor: '세운', desc: '해당 연도의 태세(太歲). 대운 위에 겹쳐지는 1년 단위 운의 흐름입니다.' },
  { hanja: '節入', kor: '절입', desc: '24절기의 시작 시각. 사주 월주 산출과 연주 경계(입춘) 판단에 분 단위까지 반영됩니다.' },
  { hanja: '支藏干', kor: '지장간', desc: '지지 속에 숨어 있는 천간. 여기(餘氣)·중기(中氣)·정기(正氣)로 구성되며 세밀한 분석에 활용됩니다.' },
  { hanja: '身强', kor: '신강', desc: '일간의 힘이 강한 상태. 월지 득령하고 주변 생조(生助)가 많을 때 나타납니다.' },
];

export default function GlossaryPage() {
  return (
    <>
      <section className={`tile-light ${styles.hero}`}>
        <div className="container">
          <h1 className={styles.title}>용어 사전</h1>
          <p className={styles.lead}>사주 명리학에서 자주 쓰이는 주요 용어를 설명합니다.</p>
        </div>
      </section>
      <section className={`tile-parchment ${styles.body}`}>
        <div className="container">
          <dl className={styles.list}>
            {TERMS.map((t, i) => (
              <div key={i} className={styles.item}>
                <dt className={styles.term}>
                  <HanjaGlyph char={t.hanja} style={{ fontSize: '28px', color: 'var(--color-primary)', opacity: 0.7 }} />
                  <span className={styles.termKor}>{t.kor}</span>
                </dt>
                <dd className={styles.def}>{t.desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
