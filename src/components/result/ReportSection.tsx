import type { SajuResult, OHaeng } from '@/store/types';
import type { CheonGan } from '@/store/types';
import { CHEONGAN_ATTR } from '@/core/saju/ganji';
import HanjaGlyph from '@/components/common/HanjaGlyph';
import DetailAccordion from '@/components/common/DetailAccordion';
import styles from './ReportSection.module.css';
import detailStyles from '@/components/common/DetailAccordion.module.css';

interface Props { result: SajuResult }

/* ── 성격 상세 ── */
const PERSONALITY_EXTRA: Record<string, { strength: string; caution: string; relationship: string; growth: string }> = {
  '甲': {
    strength: '새로운 분야를 개척하는 용기와 원칙을 지키는 일관성이 강점이에요. 한번 목표를 세우면 끝까지 밀어붙이는 추진력이 있습니다.',
    caution: '자기 의견이 강해 타인의 다른 의견을 수용하기 어려울 때가 있어요. "내 방식이 맞다"는 확신이 때로 관계에 마찰을 일으킬 수 있습니다.',
    relationship: '솔직하고 직선적이라 깊은 신뢰 관계를 형성해요. 다만 감정 표현이 직접적이어서 상대가 부담을 느낄 수 있어요.',
    growth: '다른 사람의 방식도 옳을 수 있다는 유연함을 기르는 것이 성장의 핵심이에요. 경청과 협력이 더 큰 성과를 만들어줍니다.',
  },
  '乙': {
    strength: '상황에 따라 유연하게 대처하는 능력과 섬세한 감수성이 강점이에요. 사람들의 감정을 잘 읽고 자연스럽게 친밀감을 형성합니다.',
    caution: '결정을 미루거나 직접적인 표현을 피하는 경향이 있어요. 속으로 쌓인 감정이 폭발적으로 표출될 수 있습니다.',
    relationship: '배려심이 깊고 분위기를 부드럽게 만드는 역할을 자연스럽게 해요. 상대의 필요를 먼저 챙기는 편이에요.',
    growth: '자신의 의견과 감정을 직접 표현하는 연습이 중요해요. 부탁 거절하기, 원하는 것 말하기가 관계를 더 건강하게 만들어줍니다.',
  },
  '丙': {
    strength: '밝고 에너지 넘치는 존재감으로 주변을 활기차게 만들어요. 표현력과 사교성이 뛰어나 처음 만난 사람과도 금방 가까워집니다.',
    caution: '충동적인 결정이나 과도한 자기표현에 주의가 필요해요. 흥미가 빠르게 이동하여 한 가지에 집중하기 어려울 수 있습니다.',
    relationship: '누구와도 잘 어울리는 사교적 성격이에요. 인간관계의 폭이 넓지만 깊이 있는 관계를 만들기 위해 꾸준한 노력이 필요해요.',
    growth: '한 가지 일을 끝까지 완성하는 집중력을 기르는 것이 성장의 열쇠예요. 속도보다 깊이를 추구하는 습관이 큰 성과를 만들어줍니다.',
  },
  '丁': {
    strength: '깊은 집중력과 예술적 감수성이 강점이에요. 관심 있는 분야에서는 누구보다 전문적인 수준에 도달합니다.',
    caution: '감수성이 예민해 상처를 오래 간직하는 편이에요. 때로 지나치게 이상적인 기준으로 자신과 타인을 평가할 수 있습니다.',
    relationship: '신뢰하는 소수와 깊은 관계를 맺는 것을 선호해요. 한번 마음을 준 사람에게는 매우 헌신적이에요.',
    growth: '감정을 건강하게 표현하고 흘려보내는 방법을 익히는 것이 중요해요. 완벽하지 않아도 괜찮다는 자기 수용이 성장을 도와줍니다.',
  },
  '戊': {
    strength: '묵직한 신뢰감과 포용력이 강점이에요. 한번 책임진 일은 흔들림 없이 완수하며 주변의 든든한 버팀목이 됩니다.',
    caution: '변화에 적응하는 속도가 느리고 결정이 신중한 편이에요. 고집이 강해 새로운 방식을 받아들이기 어려울 때가 있습니다.',
    relationship: '처음엔 거리감이 있어 보이지만 한번 친해지면 깊고 변함없는 관계를 유지해요. 신뢰를 쌓는 데 시간이 필요한 스타일이에요.',
    growth: '빠르게 변화하는 환경에서도 유연하게 적응하는 능력을 기르는 것이 중요해요. 작은 변화부터 편안하게 받아들이는 연습이 도움이 됩니다.',
  },
  '己': {
    strength: '세심한 배려와 현실적인 판단력이 강점이에요. 갈등 상황에서 중재자 역할을 자연스럽게 수행하고 화합을 이끌어냅니다.',
    caution: '지나친 걱정과 우유부단함으로 결정을 미루는 경향이 있어요. 모든 것을 완벽하게 준비하려다 기회를 놓칠 수 있습니다.',
    relationship: '상대의 입장을 잘 헤아리고 배려하는 따뜻한 사람이에요. 관계를 매우 소중히 여기며 주변의 평화를 중요시합니다.',
    growth: '결정을 내릴 때 완벽함보다 적절한 타이밍을 중요시하는 것이 필요해요. 자신의 판단을 믿고 과감하게 행동하는 연습이 도움이 됩니다.',
  },
  '庚': {
    strength: '결단력과 의리가 강점이에요. 불합리한 상황에 굴하지 않고 원칙대로 행동하는 강직함이 있습니다.',
    caution: '솔직함이 때로 너무 직선적으로 전달되어 상대에게 상처를 줄 수 있어요. 냉정한 인상을 주기 쉬운 편이에요.',
    relationship: '약속을 반드시 지키고 신뢰를 중시해요. 감정 표현이 서툰 편이지만 행동으로 진심을 보여주는 스타일이에요.',
    growth: '감정을 좀 더 부드럽게 표현하는 방법을 익히는 것이 관계 발전에 도움이 돼요. 상대의 감정에 먼저 공감하는 습관이 중요합니다.',
  },
  '辛': {
    strength: '섬세한 심미안과 날카로운 분석력이 강점이에요. 완성도 높은 결과물을 만들어내는 집착과 집중력이 탁월합니다.',
    caution: '완벽주의 성향으로 자신과 타인에게 높은 기준을 적용해요. 비판적 시각이 때로 관계를 어렵게 만들 수 있습니다.',
    relationship: '깊은 신뢰를 쌓은 후에야 마음을 여는 편이에요. 외로움을 많이 타고 상대의 세심한 관심을 중요시합니다.',
    growth: '완벽하지 않아도 충분히 가치 있다는 것을 인정하는 연습이 중요해요. 비판보다 인정하고 칭찬하는 습관이 관계를 풍요롭게 만들어줍니다.',
  },
  '壬': {
    strength: '지적 호기심과 넓은 포용력이 강점이에요. 다양한 관점에서 상황을 파악하고 창의적인 해결책을 제시하는 능력이 있습니다.',
    caution: '관심사가 넓어 한 가지에 깊이 집중하기 어려울 수 있어요. 감정 표현이 절제되어 상대가 마음을 파악하기 어려울 때가 있습니다.',
    relationship: '자유로운 분위기를 선호하고 지적인 대화를 중요시해요. 형식적인 관계보다 진정한 정신적 교류를 원합니다.',
    growth: '감정을 적극적으로 표현하고 한 가지 일에 꾸준히 집중하는 훈련이 성장에 도움이 돼요. 시작한 일을 끝까지 완성하는 경험을 쌓아보세요.',
  },
  '癸': {
    strength: '깊은 직관력과 공감 능력이 강점이에요. 타인의 감정과 상황을 깊이 이해하고 세밀한 통찰력으로 문제의 본질을 파악합니다.',
    caution: '감정 기복이 있고 내면 세계에 너무 깊이 빠지는 경향이 있어요. 현실적인 결단을 미루는 경향이 있습니다.',
    relationship: '조용하지만 깊이 있는 교감을 나누는 관계를 선호해요. 감정적 유대가 깊고 상대의 마음을 세심하게 챙깁니다.',
    growth: '직관에만 의존하지 않고 현실적인 행동 계획을 세우는 습관이 필요해요. 감정을 글이나 예술로 표현하는 것이 내면의 건강을 유지하는 데 도움이 됩니다.',
  },
};

/* ── 직업 상세 ── */
const CAREER_EXTRA: Record<OHaeng, { detail: string; wealth: string; practice: string }> = {
  '木': {
    detail: '교육·강의, 출판·콘텐츠, 법률·행정, 기획·연구, 컨설팅, 환경·산림, 한의학 분야에서 특히 두각을 나타낼 수 있어요. 새로운 프로젝트를 시작하고 방향을 제시하는 역할이 잘 맞습니다.',
    wealth: '재물은 꾸준한 성장 방식으로 쌓여요. 단기적인 투기보다 장기적인 투자와 역량 개발이 더 큰 결실을 맺습니다. 부동산보다 지식·기술 투자가 유리한 편이에요.',
    practice: '동쪽 방향 활동, 초록 계열 환경 조성, 식물 가꾸기, 새벽 시간 활용이 도움이 돼요. 학습과 성장에 지속적으로 투자하세요.',
  },
  '火': {
    detail: 'IT·전자, 방송·미디어·연예, 마케팅·홍보, 금융투자, 에너지·화학, 의료(외과·안과) 분야가 잘 맞아요. 사람들 앞에서 표현하고 이끄는 역할에서 에너지가 살아납니다.',
    wealth: '재물운이 활발하고 기회가 빠르게 찾아와요. 다만 충동적인 투자나 과도한 소비에 주의가 필요해요. 사람들과의 네트워크를 통해 기회가 열리는 편이에요.',
    practice: '남쪽 방향 활동, 밝고 따뜻한 환경, 사람들과의 교류, 창의적 프로젝트 참여가 도움이 돼요. 열정을 살려줄 수 있는 커뮤니티에 참여하세요.',
  },
  '土': {
    detail: '부동산·건설, 농업·식품, 공무원·행정, 물류·유통, 교육(초등·유아), 중재·조정 분야가 잘 맞아요. 안정적인 기반 위에서 꾸준히 성과를 만들어가는 스타일이에요.',
    wealth: '재물이 천천히 쌓이지만 잃지 않고 안정적으로 유지되는 편이에요. 부동산·실물 자산이 유리하고 저축과 꾸준한 투자가 장기적으로 좋은 결과를 만들어줍니다.',
    practice: '중심을 잡는 루틴 형성, 신뢰 기반의 인간관계 관리, 안정적인 저축 계획 수립이 도움이 돼요. 땅과 가까운 활동(정원 가꾸기, 등산 등)도 좋아요.',
  },
  '金': {
    detail: '금융·증권, 법률·사법, 군·경찰, 제조·기계, 의료(치과·정형외과), 감사·컨설팅 분야가 잘 맞아요. 명확한 규칙과 원칙이 있는 환경에서 최고의 역량을 발휘합니다.',
    wealth: '계획적인 재무 관리로 안정적인 자산을 쌓는 유형이에요. 무형 자산보다 금융·실물 자산 투자가 잘 맞아요. 원칙 있는 투자 원칙을 지키는 것이 중요해요.',
    practice: '서쪽 방향 활동, 흰색·금속 계열 환경, 명확한 목표와 계획 수립, 규칙적인 습관 형성이 도움이 돼요. 운동이나 명상으로 마음의 예리함을 유지하세요.',
  },
  '水': {
    detail: '무역·해외, 물류·여행, 예술·창작, 철학·상담, IT·소통, 의료(내과·정신건강) 분야가 잘 맞아요. 다양한 분야를 경험하며 폭넓은 커리어를 쌓는 스타일이에요.',
    wealth: '재물이 유동적으로 들어오고 나가는 편이에요. 한 곳에 집중 투자하기보다 다각화가 유리해요. 해외·무역 관련 분야나 지식 콘텐츠 사업에서 기회가 열릴 수 있어요.',
    practice: '북쪽 방향 활동, 물 가까운 환경(강변·바다), 독서와 지적 탐구, 유연한 일과 운용이 도움이 돼요. 새로운 사람·장소·경험에 꾸준히 자신을 노출시키세요.',
  },
};

/* ── 용신 일상 실천 ── */
const OHAENG_DAILY: Record<OHaeng, { items: string[] }> = {
  '木': { items: ['동쪽 방향으로 공부·작업 공간 배치', '초록 계열 식물·소품 두기', '새벽 시간 활용 (아침형 생활)', '계획 수립과 학습에 꾸준히 투자', '숲·공원 산책'] },
  '火': { items: ['밝고 따뜻한 조명 환경 만들기', '남쪽 방향 활동 공간 활용', '사람들과의 교류·네트워킹 적극 참여', '창의적 표현 활동 (그림, 글쓰기, 발표)', '따뜻한 색상 계열 환경'] },
  '土': { items: ['규칙적인 루틴·생활 패턴 만들기', '중앙 배치 공간 활용', '신뢰할 수 있는 인간관계 관리', '실용적이고 장기적인 목표 수립', '대지와 가까운 활동 (등산, 텃밭)'] },
  '金': { items: ['서쪽 방향 공간 활용', '흰색·회색·금속 계열 환경', '명확한 계획과 원칙 세우기', '정밀한 작업이나 분석 활동', '규칙적인 운동으로 에너지 조절'] },
  '水': { items: ['북쪽 방향 공간 활용', '물 가까운 환경 즐기기 (수영, 바다)', '독서와 지적 탐구 습관', '유연한 일정 운용 (틀에 얽매이지 않기)', '다양한 경험과 여행'] },
};

export default function ReportSection({ result }: Props) {
  const { pillars, personalityText, careerText, yongShin } = result;
  const dayGan = pillars.day.gan;
  const dayAttr = CHEONGAN_ATTR[dayGan];
  const dayOhaeng = dayAttr.ohaeng;

  const keywords = generateKeywords(result);
  const personalityEx = PERSONALITY_EXTRA[dayGan];
  const careerEx = CAREER_EXTRA[dayOhaeng];

  return (
    <div className={styles.wrap}>
      <HanjaGlyph char="命" size="tile" opacity={0.04} className={styles.watermark} />

      {/* 성격 기질 */}
      <section className={styles.section} aria-labelledby="personality-title">
        <div className={styles.sectionHead}>
          <span aria-hidden="true" className={styles.hanja}>性</span>
          <h2 id="personality-title" className={styles.title}>성격·기질</h2>
        </div>
        <div className={styles.keywords}>
          {keywords.map((kw, i) => (
            <span key={i} className={styles.keyword}>{kw}</span>
          ))}
        </div>
        <div className={styles.body}>
          {personalityText.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        {personalityEx && (
          <DetailAccordion label="더 자세히 보기">
            <div className={detailStyles.detailCard}>
              <div className={detailStyles.row}>
                <h4>✦ 핵심 강점</h4>
                <p>{personalityEx.strength}</p>
              </div>
              <div className={detailStyles.row}>
                <h4>⚠ 주의할 점</h4>
                <p>{personalityEx.caution}</p>
              </div>
              <div className={detailStyles.row}>
                <h4>🤝 인간관계 스타일</h4>
                <p>{personalityEx.relationship}</p>
              </div>
              <div className={detailStyles.row}>
                <h4>🌱 성장 방향</h4>
                <p>{personalityEx.growth}</p>
              </div>
            </div>
          </DetailAccordion>
        )}
      </section>

      {/* 직업·재물 */}
      <section className={styles.section} aria-labelledby="career-title">
        <div className={styles.sectionHead}>
          <span aria-hidden="true" className={styles.hanja}>業</span>
          <h2 id="career-title" className={styles.title}>직업·재물</h2>
        </div>
        <div className={styles.body}>
          {careerText.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        {careerEx && (
          <DetailAccordion label="더 자세히 보기">
            <div className={detailStyles.detailCard}>
              <div className={detailStyles.row}>
                <h4>💼 세부 적합 직종</h4>
                <p>{careerEx.detail}</p>
              </div>
              <div className={detailStyles.row}>
                <h4>💰 재물 운 패턴</h4>
                <p>{careerEx.wealth}</p>
              </div>
              <div className={detailStyles.row}>
                <h4>📌 일상 실천 가이드</h4>
                <p>용신({yongShin.yongShin}) 방향을 살리는 환경을 만들어보세요.</p>
                <ul>
                  {(OHAENG_DAILY[yongShin.yongShin]?.items ?? []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </DetailAccordion>
        )}
      </section>

      {/* 용신 활용 */}
      <section className={styles.section} aria-labelledby="yong-title">
        <div className={styles.sectionHead}>
          <span aria-hidden="true" className={styles.hanja}>用</span>
          <h2 id="yong-title" className={styles.title}>용신 활용법</h2>
        </div>
        <p className={styles.sectionLead}>
          용신(用神)은 내 사주에서 가장 필요한 기운, 희신(喜神)은 그것을 도와주는 기운, 기신(忌神)은 주의해야 할 기운입니다.
        </p>
        <div className={styles.yongGuide}>
          <div className={styles.yongItem}>
            <div className={styles.yongKeyRow}>
              <p className={styles.yongKey}>용신 <strong>{yongShin.yongShin}</strong></p>
              <span className={styles.yongModernTag}>나에게 필요한 기운</span>
            </div>
            <p className={styles.yongVal}>{getOhaengGuide(yongShin.yongShin)}</p>
          </div>
          <div className={styles.yongItem}>
            <div className={styles.yongKeyRow}>
              <p className={styles.yongKey}>희신 <strong>{yongShin.huiShin}</strong></p>
              <span className={styles.yongModernTag}>용신을 돕는 기운</span>
            </div>
            <p className={styles.yongVal}>{getOhaengGuide(yongShin.huiShin)}</p>
          </div>
          <div className={`${styles.yongItem} ${styles.giShin}`}>
            <div className={styles.yongKeyRow}>
              <p className={styles.yongKey}>기신 <strong>{yongShin.giShin}</strong></p>
              <span className={`${styles.yongModernTag} ${styles.giTag}`}>주의해야 할 기운</span>
            </div>
            <p className={styles.yongVal}>{getOhaengGuideAvoid(yongShin.giShin)}</p>
          </div>
        </div>
        <DetailAccordion label="용신을 일상에서 어떻게 활용하나요?">
          <div className={detailStyles.detailCard}>
            <div className={detailStyles.row}>
              <h4>✦ 용신({yongShin.yongShin}) 활성화 방법</h4>
              <ul>
                {(OHAENG_DAILY[yongShin.yongShin]?.items ?? []).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={detailStyles.row}>
              <h4>✦ 희신({yongShin.huiShin}) 활성화 방법</h4>
              <ul>
                {(OHAENG_DAILY[yongShin.huiShin]?.items ?? []).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={detailStyles.row}>
              <h4>⚠ 기신({yongShin.giShin}) — 이런 환경은 주의하세요</h4>
              <p>{getOhaengGuideAvoid(yongShin.giShin)}</p>
              <p style={{ marginTop: '6px', fontSize: '13px', opacity: 0.75 }}>※ 특정 오행을 가진 사람을 피하라는 의미가 아니에요. 환경의 기운을 조절하는 것이 핵심입니다.</p>
            </div>
          </div>
        </DetailAccordion>
      </section>

      <p className={styles.disclaimer}>
        * 본 해석은 명리학 연구 목적으로 제공됩니다. 의료·법률·재무 조언이 아니며, 단정적 예언이 아닌 경향과 가능성을 서술합니다.
      </p>
    </div>
  );
}

function generateKeywords(result: SajuResult): string[] {
  const gan = result.pillars.day.gan;
  const kw: Record<string, string[]> = {
    '甲': ['진취적', '원칙주의', '리더십', '개척정신', '직선적'],
    '乙': ['유연함', '친화력', '심미안', '적응력', '섬세함'],
    '丙': ['열정적', '사교적', '낙천적', '표현력', '밝음'],
    '丁': ['집중력', '예술성', '직관력', '섬세함', '내면 깊이'],
    '戊': ['믿음직', '포용력', '신중함', '안정 지향', '묵직함'],
    '己': ['배려심', '실용적', '조화', '세심함', '현실적'],
    '庚': ['결단력', '의리', '솔직함', '강직함', '실행력'],
    '辛': ['완벽주의', '미적 감각', '분석력', '섬세함', '예리함'],
    '壬': ['지혜', '포용', '전략적', '호기심', '유연함'],
    '癸': ['직관', '신비로움', '감수성', '깊이', '영감'],
  };
  return kw[gan] || [];
}

function getOhaengGuide(o: OHaeng): string {
  const m: Record<OHaeng, string> = {
    '木': '동쪽 방향, 초록 계열 환경, 나무·식물 가까이 하기, 학습·성장 활동',
    '火': '남쪽 방향, 밝고 따뜻한 환경, 사람들과의 교류, 창의적 표현 활동',
    '土': '중앙·대지 관련 환경, 안정된 루틴, 신뢰 기반 관계, 현실적 목표 설정',
    '金': '서쪽 방향, 흰색·금속 계열, 명확한 원칙과 규율, 정밀한 작업',
    '水': '북쪽 방향, 물 가까운 환경, 지적 탐구, 유연한 사고와 소통',
  };
  return m[o];
}

function getOhaengGuideAvoid(o: OHaeng): string {
  const m: Record<OHaeng, string> = {
    '木': '지나친 계획·확장에 주의, 고집스러운 상황 피하기',
    '火': '과도한 흥분·충동 주의, 지나친 과시 상황 피하기',
    '土': '무거운 책임감이 누적되는 상황 주의, 변화를 거부하는 환경 피하기',
    '金': '지나친 규율·경직된 환경 주의, 비판적 분위기 피하기',
    '水': '감정적 소용돌이 환경 주의, 방향 없는 유동성 피하기',
  };
  return m[o];
}
