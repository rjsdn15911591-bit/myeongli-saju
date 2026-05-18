import type { OHaengDistribution, YongShin, OHaeng } from '@/store/types';
import { CHEONGAN_ATTR } from '@/core/saju/ganji';
import type { CheonGan } from '@/store/types';
import HanjaGlyph from '@/components/common/HanjaGlyph';
import DetailAccordion from '@/components/common/DetailAccordion';
import styles from './OhaengChart.module.css';
import detailStyles from '@/components/common/DetailAccordion.module.css';

const OHAENG_KOR: Record<OHaeng, string> = { '木': '목', '火': '화', '土': '토', '金': '금', '水': '수' };
const OHAENG_DESC: Record<OHaeng, string> = {
  '木': '성장·창의·계획', '火': '열정·표현·소통',
  '土': '안정·신뢰·중재', '金': '결단·정밀·의지',
  '水': '지혜·적응·깊이',
};
const OHAENG_DETAIL: Record<OHaeng, string> = {
  '木': '나무의 기운이에요. 봄처럼 새로운 일을 시작하고 성장하는 에너지입니다. 창의적인 사고, 계획 수립, 미래를 향한 추진력을 나타내요. 仁(인)의 덕목과 연결됩니다.',
  '火': '불의 기운이에요. 여름처럼 밝고 뜨거운 에너지입니다. 열정, 표현력, 사교성, 화려함을 나타내고 예술·미디어·소통과 관련이 깊어요. 禮(예)의 덕목과 연결됩니다.',
  '土': '흙의 기운이에요. 사계절의 중심으로 안정과 포용을 상징합니다. 신뢰감, 중재력, 꾸준함을 나타내며 현실적인 기반을 만드는 힘이에요. 信(신)의 덕목과 연결됩니다.',
  '金': '금속의 기운이에요. 가을처럼 수렴하고 정돈하는 에너지입니다. 결단력, 의리, 정밀함을 나타내고 원칙을 중시하는 힘이에요. 義(의)의 덕목과 연결됩니다.',
  '水': '물의 기운이에요. 겨울처럼 깊고 유연한 에너지입니다. 지혜, 적응력, 소통 능력, 깊은 사유를 나타내요. 智(지)의 덕목과 연결됩니다.',
};

interface Props {
  distribution: OHaengDistribution;
  yongShin: YongShin;
  dayGan: CheonGan;
  strengthText: string;
}

export default function OhaengChart({ distribution, yongShin, dayGan, strengthText }: Props) {
  const dayOhaeng = CHEONGAN_ATTR[dayGan].ohaeng;
  const entries = Object.entries(distribution) as [OHaeng, number][];

  const YONG_LABELS: Record<keyof YongShin, { main: string; sub: string }> = {
    yongShin: { main: '용신',  sub: '나에게 필요한 기운' },
    huiShin:  { main: '희신',  sub: '용신을 돕는 기운' },
    giShin:   { main: '기신',  sub: '주의해야 할 기운' },
    guShin:   { main: '구신',  sub: '기신을 돕는 기운' },
    hanShin:  { main: '한신',  sub: '중립적 기운' },
    isGangShin: { main: '', sub: '' },
  };

  return (
    <div className={styles.wrap}>
      {/* 강약 판단 */}
      <div className={styles.gangWeak}>
        <div className={styles.gangBadgeWrap}>
          <span className={`${styles.gangBadge} ${yongShin.isGangShin ? styles.gang : styles.weak}`}>
            {yongShin.isGangShin ? '신강(身强)' : '신약(身弱)'}
          </span>
          <span className={styles.gangModern}>
            {yongShin.isGangShin ? '내 기운이 충분한 사주' : '외부 도움을 잘 활용하는 사주'}
          </span>
        </div>
        <p className={styles.gangText}>{strengthText}</p>
      </div>

      <DetailAccordion label="신강·신약이 뭔가요?" variant="dark">
        <div className={detailStyles.detailCard}>
          {yongShin.isGangShin ? (
            <>
              <h4>신강(身强)이란?</h4>
              <p>일간(나 자신)의 기운이 원국 전체에서 강한 상태예요. 나와 같은 오행(비겁)이나 나를 생해주는 오행(인성)의 힘이 클 때 신강이 됩니다.</p>
              <h4>어떤 특징이 있나요?</h4>
              <ul>
                <li>자기 주관이 뚜렷하고 에너지가 넘쳐요</li>
                <li>주도적으로 일을 이끌어가는 경향이 강해요</li>
                <li>이 기운을 충분히 발산하지 못하면 고집이나 답답함으로 나타날 수 있어요</li>
              </ul>
              <h4>어떻게 균형을 맞추나요?</h4>
              <p>표현·창작 활동(식상), 현실적 성과와 활동(재성), 책임감 있는 역할(관성)의 기운이 강해지는 환경에서 균형을 찾아요. 에너지를 적극적으로 사용하고 결과로 이어지는 삶이 도움이 됩니다.</p>
            </>
          ) : (
            <>
              <h4>신약(身弱)이란?</h4>
              <p>일간의 기운이 원국에서 약한 상태예요. 나를 克하거나 설기하는 오행(재성·관성)의 힘이 클 때 신약이 됩니다.</p>
              <h4>어떤 특징이 있나요?</h4>
              <ul>
                <li>주변 환경과 사람들의 영향을 예민하게 받아요</li>
                <li>협력적이고 적응력이 뛰어난 편이에요</li>
                <li>자기 자신을 꾸준히 돌보고 에너지를 보충하는 것이 중요해요</li>
              </ul>
              <h4>어떻게 균형을 맞추나요?</h4>
              <p>나를 인정해주는 동료(비겁), 배움과 지원(인성)의 기운이 강해지는 환경이 좋아요. 자신을 지지해주는 사람들과 함께하고 꾸준히 실력을 쌓는 삶이 도움이 됩니다.</p>
            </>
          )}
        </div>
      </DetailAccordion>

      {/* 오행 분포 */}
      <div className={styles.chart}>
        {entries.map(([key, val]) => (
          <div key={key} className={styles.rowGroup}>
            <div className={styles.row}>
              <div className={styles.rowLeft}>
                <HanjaGlyph char={key} size="icon" style={{ fontSize: '20px', fontWeight: 300 }} />
                <span className={styles.korName}>{OHAENG_KOR[key]}</span>
                <span className={styles.desc}>{OHAENG_DESC[key]}</span>
              </div>
              <div className={styles.barWrap}>
                <div
                  className={styles.bar}
                  style={{
                    width: `${val}%`,
                    background: key === dayOhaeng
                      ? 'var(--color-primary-on-dark)'
                      : 'rgba(255,255,255,0.2)',
                  }}
                  role="progressbar"
                  aria-valuenow={val}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${OHAENG_KOR[key]} ${val}%`}
                />
              </div>
              <span className={styles.pct}>{val}%</span>
            </div>
            <DetailAccordion label={`${OHAENG_KOR[key]}(${key}) 더 알아보기`} variant="dark">
              <div className={detailStyles.detailCard}>
                <p>{OHAENG_DETAIL[key]}</p>
                {val >= 40 && (
                  <p style={{ marginTop: '8px' }}>
                    <strong>내 사주에서의 의미:</strong> 이 기운이 {val}%로 강하게 분포되어 있어요. {key === dayOhaeng ? '일간과 같은 오행으로, 나의 핵심 에너지입니다.' : '원국에 이 기운이 풍부해요.'}
                  </p>
                )}
                {val <= 10 && (
                  <p style={{ marginTop: '8px' }}>
                    <strong>내 사주에서의 의미:</strong> 이 기운이 {val}%로 약하게 분포되어 있어요. 이 오행의 특성을 보완하는 환경을 갖추면 균형에 도움이 됩니다.
                  </p>
                )}
              </div>
            </DetailAccordion>
          </div>
        ))}
      </div>

      {/* 용신 */}
      <div className={styles.yongShinGrid}>
        {(Object.entries(yongShin) as [keyof YongShin, OHaeng | boolean][])
          .filter(([k]) => k !== 'isGangShin')
          .map(([k, v]) => (
            <div key={k} className={styles.yongItem}>
              <p className={styles.yongLabel}>{YONG_LABELS[k].main}</p>
              <p className={styles.yongModern}>{YONG_LABELS[k].sub}</p>
              <HanjaGlyph char={v as string} size="icon" style={{ fontSize: '28px', color: 'var(--color-primary-on-dark)' }} />
              <p className={styles.yongKor}>{OHAENG_KOR[v as OHaeng]}</p>
            </div>
          ))}
      </div>

      <DetailAccordion label="용신·희신·기신이 뭔가요?" variant="dark">
        <div className={detailStyles.detailCard}>
          <div className={detailStyles.row}>
            <span className={detailStyles.tag}>용신 (用神)</span>
            <p>내 사주의 불균형을 바로잡아주는 핵심 오행이에요. 직업·주거 방향·인간관계에서 용신의 특성을 살리면 삶이 더 순조로워집니다.</p>
          </div>
          <div className={detailStyles.row}>
            <span className={detailStyles.tag}>희신 (喜神)</span>
            <p>용신을 도와주는 오행이에요. 용신과 함께 긍정적인 에너지를 만들어냅니다.</p>
          </div>
          <div className={detailStyles.row}>
            <span className={detailStyles.tag}>기신 (忌神)</span>
            <p>내 사주의 균형을 해치는 오행이에요. 이 기운이 강해지는 시기·환경에서는 신중하게 행동하는 것이 좋아요.<br /><strong>⚠ 단, 이 오행을 가진 사람을 피하라는 뜻이 아니에요.</strong></p>
          </div>
          <div className={detailStyles.row}>
            <span className={detailStyles.tag}>구신 (仇神)</span>
            <p>기신의 힘을 더 키워주는 오행이에요. 기신과 함께 주의가 필요합니다.</p>
          </div>
          <div className={detailStyles.row}>
            <span className={detailStyles.tag}>한신 (閑神)</span>
            <p>크게 도움도 방해도 않는 중립적인 오행이에요.</p>
          </div>
        </div>
      </DetailAccordion>
    </div>
  );
}
