import type { SaJuPillar, OHaengDistribution, RelationResult, OHaeng } from '@/store/types';
import { CHEONGAN_ATTR, JIJI_ATTR } from '@/core/saju/ganji';
import HanjaGlyph from '@/components/common/HanjaGlyph';
import DetailAccordion from '@/components/common/DetailAccordion';
import styles from './SajuCard.module.css';
import detailStyles from '@/components/common/DetailAccordion.module.css';

const OHAENG_COLOR: Record<OHaeng, string> = {
  '木': '#2d6a4f', '火': '#b83c10', '土': '#8b6914', '金': '#4a5568', '水': '#1a3a5c',
};
const OHAENG_LABEL: Record<OHaeng, string> = {
  '木': '목', '火': '화', '土': '토', '金': '금', '水': '수',
};

const RELATION_DETAIL: Record<string, string> = {
  '천간합': '천간합(天干合)은 두 천간(天干)이 서로 만나 합쳐지는 것이에요. 대체로 두 기운이 협력하며 새로운 오행으로 변화하거나 서로를 끌어당기는 관계가 됩니다. 합이 있으면 인연이 깊거나 특정 기운이 변화할 수 있어요.',
  '삼합': '삼합(三合)은 세 지지(地支)가 모여 하나의 오행 기운을 강하게 형성하는 것이에요. 관련 오행의 힘이 매우 강해져 그 방향의 삶에 강한 에너지가 실립니다.',
  '육합': '육합(六合)은 두 지지가 서로 합쳐지는 것이에요. 천간합처럼 두 기운이 서로 친밀하게 합쳐지며 협조적인 관계를 형성합니다.',
  '방합': '방합(方合)은 같은 계절의 세 지지가 모여 방향의 기운을 강화하는 것이에요. 봄·여름·가을·겨울의 계절 기운이 집중됩니다.',
  '충': '충(沖)은 두 지지가 서로 강하게 부딪히는 것이에요. 에너지의 충돌로 변화가 생기거나 불안정한 시기가 올 수 있어요. 나쁜 것만은 아니며 때로 정체된 상황을 돌파하는 계기가 되기도 합니다.',
  '형': '형(刑)은 세 지지가 서로 자극하는 관계예요. 마찰이나 갈등이 생길 수 있지만 동시에 강한 추진력이 생기기도 해요.',
  '파': '파(破)는 두 지지가 서로 깨뜨리는 관계예요. 계획이나 관계에 균열이 생길 수 있어 주의가 필요합니다.',
  '해': '해(害)는 두 지지가 서로 해를 끼치는 관계예요. 인간관계나 일에서 방해 요소가 생길 수 있어요.',
};

interface SajuCardProps {
  pillars: SaJuPillar;
  ohaeng: OHaengDistribution;
  relations: RelationResult[];
  isDark?: boolean;
}

interface PillarColProps {
  label: string;
  gan: string;
  ji: string;
  isDay?: boolean;
}

function PillarCol({ label, gan, ji, isDay }: PillarColProps) {
  const ganAttr = CHEONGAN_ATTR[gan as keyof typeof CHEONGAN_ATTR];
  const jiAttr  = JIJI_ATTR[ji  as keyof typeof JIJI_ATTR];
  return (
    <div className={`${styles.pillarCol} ${isDay ? styles.dayCol : ''}`}>
      <p className={styles.pillarLabel}>{label}</p>
      <div className={styles.ganWrap}>
        <span className={styles.ganDot} style={{ background: OHAENG_COLOR[ganAttr.ohaeng] }} aria-hidden="true" />
        <HanjaGlyph char={gan} size="hero" className={styles.glyph} />
        <span className={styles.korLabel}>{ganAttr.korName} <span className={styles.korOhaeng}>{OHAENG_LABEL[ganAttr.ohaeng]}</span></span>
      </div>
      <div className={styles.jiWrap}>
        <span className={styles.ganDot} style={{ background: OHAENG_COLOR[jiAttr.ohaeng] }} aria-hidden="true" />
        <HanjaGlyph char={ji} size="hero" className={styles.glyph} />
        <span className={styles.korLabel}>{jiAttr.korName} <span className={styles.korOhaeng}>{OHAENG_LABEL[jiAttr.ohaeng]}</span></span>
      </div>
    </div>
  );
}

export default function SajuCard({ pillars, ohaeng, relations, isDark }: SajuCardProps) {
  const ohaengEntries = Object.entries(ohaeng) as [OHaeng, number][];
  const dayGanOhaeng = CHEONGAN_ATTR[pillars.day.gan].ohaeng;

  return (
    <div className={`${styles.card} ${isDark ? styles.dark : ''}`}>
      <HanjaGlyph char="八字" size="tile" opacity={0.05} className={styles.watermark} />

      {/* 4주 */}
      <div className={styles.pillarsRow}>
        <PillarCol label="연주 年柱" gan={pillars.year.gan}  ji={pillars.year.ji} />
        <PillarCol label="월주 月柱" gan={pillars.month.gan} ji={pillars.month.ji} />
        <PillarCol label="일주 日柱" gan={pillars.day.gan}   ji={pillars.day.ji} isDay />
        {pillars.hour
          ? <PillarCol label="시주 時柱" gan={pillars.hour.gan} ji={pillars.hour.ji} />
          : <div className={styles.pillarCol}>
              <p className={styles.pillarLabel}>시주 時柱</p>
              <div className={styles.unknownTime}>시간 미입력</div>
            </div>
        }
      </div>

      <DetailAccordion label="각 기둥이 무엇을 의미하나요?">
        <div className={detailStyles.detailCard}>
          <div className={detailStyles.row}>
            <h4>📌 연주(年柱) — 부모·가정환경·유년기</h4>
            <p>태어난 해의 기운이에요. 부모님과 가정환경, 어린 시절의 사회적 배경을 나타냅니다. 조상으로부터 물려받은 환경적 기운을 담고 있어요.</p>
          </div>
          <div className={detailStyles.row}>
            <h4>📌 월주(月柱) — 직업·사회생활·청장년기 <strong>[사주에서 가장 강한 자리]</strong></h4>
            <p>태어난 달의 기운이에요. 형제자매·직업·사회활동을 나타냅니다. 특히 <strong>월지(月支)는 사주 중 가장 힘이 센 자리</strong>로 성격, 직업운, 건강에 가장 큰 영향을 미쳐요.</p>
          </div>
          <div className={detailStyles.row}>
            <h4>📌 일주(日柱) — 나 자신·배우자 <strong>[사주의 중심]</strong></h4>
            <p>일간(天干)이 바로 <strong>'나 자신'</strong>이에요. 모든 십신(十神) 분석의 기준이 됩니다. 일지(地支)는 '배우자궁'으로 배우자의 성격과 인연을 보여줘요.</p>
          </div>
          <div className={detailStyles.row}>
            <h4>📌 시주(時柱) — 자녀·말년·결실</h4>
            <p>자녀운과 노후의 삶을 나타내요. 시간을 입력하지 않았다면 이 기둥 분석은 참고 정도로만 활용하세요.</p>
          </div>
          <div className={detailStyles.row}>
            <h4>💡 천간(天干)과 지지(地支)란?</h4>
            <p>각 기둥은 위쪽 글자(천간, 天干)와 아래쪽 글자(지지, 地支)로 구성돼요. 천간은 겉으로 드러나는 기운, 지지는 내면에 숨어있는 기운을 나타냅니다.</p>
          </div>
        </div>
      </DetailAccordion>

      {/* 관계 배지 */}
      {relations.length > 0 && (
        <>
          <div className={styles.relations}>
            {relations.map((r, i) => (
              <span key={i} className={`${styles.badge} ${styles[`badge_${r.type}`]}`}>
                {r.description}
              </span>
            ))}
          </div>
          <DetailAccordion label="합·충·형이 무엇인가요?">
            <div className={detailStyles.detailCard}>
              <p style={{ marginBottom: '12px' }}>원국에서 글자들이 서로 만나면 특별한 작용이 생겨요. 좋고 나쁨을 단정 짓기보다는 에너지의 방향으로 이해하는 것이 좋습니다.</p>
              {Array.from(new Set(relations.map(r => r.type))).map(type => (
                <div key={type} className={detailStyles.row}>
                  <span className={detailStyles.tag}>{type}</span>
                  <p>{RELATION_DETAIL[type] ?? '두 글자 사이의 특별한 상호작용이에요.'}</p>
                </div>
              ))}
            </div>
          </DetailAccordion>
        </>
      )}

      {/* 오행 분포 바 */}
      <div className={styles.ohaengBar}>
        {ohaengEntries.map(([key, val]) => (
          <div key={key} className={styles.ohaengItem}>
            <div className={styles.ohaengLabelRow}>
              <HanjaGlyph char={key} size="icon" style={{ fontSize: '18px' }} />
              <span className={styles.ohaengKor}>{OHAENG_LABEL[key]}</span>
              <span className={styles.ohaengPct}>{val}%</span>
            </div>
            <div className={styles.ohaengTrack}>
              <div
                className={styles.ohaengFill}
                style={{
                  width: `${val}%`,
                  background: key === dayGanOhaeng ? 'var(--color-primary)' : 'var(--hairline)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
