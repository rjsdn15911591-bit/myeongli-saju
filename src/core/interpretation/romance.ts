import type { SaJuPillar, YongShin, ShinShin, OHaeng, OHaengDistribution, SpouseStats } from '@/store/types';
import { CHEONGAN_ATTR, JIJI_ATTR, OVERCOMING } from '@/core/saju/ganji';

// What ohaeng X is overcome by (inverse of OVERCOMING)
const OVERCOME_BY: Record<OHaeng, OHaeng> = {
  '木': '金', '火': '水', '土': '木', '金': '火', '水': '土',
};

// 배우자 성별에 따라 동물상 분리
// 여성 배우자 (남성이 입력한 경우)
const JIJI_FACE_FEMALE: Record<string, string> = {
  '子': '고양이상', '丑': '강아지상', '寅': '호랑이상', '卯': '토끼상',
  '辰': '여우상',   '巳': '여우상',   '午': '고양이상', '未': '토끼상',
  '申': '여우상',   '酉': '고양이상', '戌': '강아지상', '亥': '토끼상',
};
// 남성 배우자 (여성이 입력한 경우)
const JIJI_FACE_MALE: Record<string, string> = {
  '子': '고양이상', '丑': '곰상',     '寅': '호랑이상', '卯': '강아지상',
  '辰': '여우상',   '巳': '여우상',   '午': '강아지상', '未': '강아지상',
  '申': '여우상',   '酉': '고양이상', '戌': '강아지상', '亥': '곰상',
};

function clamp(v: number, min = 18, max = 97): number {
  return Math.min(max, Math.max(min, Math.round(v)));
}

function hasSS(map: Record<string, ShinShin>, ...types: ShinShin[]): boolean {
  const vals = Object.values(map) as ShinShin[];
  return types.some(t => vals.includes(t));
}

export function computeSpouseStats(
  pillars: SaJuPillar,
  gender: '남' | '여',
  ohaeng: OHaengDistribution,
  yongShin: YongShin,
  shinShinMap: Record<string, ShinShin>
): SpouseStats {
  const dayGanOhaeng = CHEONGAN_ATTR[pillars.day.gan].ohaeng;
  const dayJiAttr = JIJI_ATTR[pillars.day.ji];
  const dayJiOhaeng = dayJiAttr.ohaeng;

  // 배우자 별성 오행: 여성=관성(나를 극하는 것), 남성=재성(내가 극하는 것)
  const spouseOhaeng: OHaeng = gender === '여'
    ? OVERCOME_BY[dayGanOhaeng]
    : OVERCOMING[dayGanOhaeng];

  const spouseEnergy = ohaeng[spouseOhaeng];

  // 재력 — 金 기운, 재성
  const wealth = clamp(
    50
    + ohaeng['金'] * 0.38
    + (spouseOhaeng === '金' ? spouseEnergy * 0.18 : spouseEnergy * 0.03)
    + (dayJiOhaeng === '金' ? 11 : dayJiOhaeng === '土' ? 5 : 0)
    + (hasSS(shinShinMap, '정재', '편재') ? 8 : 0)
    + (yongShin.yongShin === '金' ? 5 : 0)
  );

  // 능력 — 木/金 기운, 관성
  const ability = clamp(
    48
    + (ohaeng['木'] + ohaeng['金']) * 0.22
    + ((spouseOhaeng === '木' || spouseOhaeng === '金') ? spouseEnergy * 0.18 : spouseEnergy * 0.05)
    + (dayJiOhaeng === '木' || dayJiOhaeng === '金' ? 9 : 0)
    + (hasSS(shinShinMap, '정관', '편관') ? 8 : 0)
    + (yongShin.isGangShin ? 4 : 0)
  );

  // 다정함 — 水/木 기운, 음(陰)
  const affection = clamp(
    53
    + ohaeng['水'] * 0.32
    + ohaeng['木'] * 0.15
    + ((spouseOhaeng === '水' || spouseOhaeng === '木') ? spouseEnergy * 0.18 : spouseEnergy * 0.04)
    + (dayJiAttr.eumyang === '陰' ? 9 : 0)
    + (hasSS(shinShinMap, '정인', '편인') ? 7 : 0)
    + (dayJiOhaeng === '水' || dayJiOhaeng === '木' ? 6 : 0)
  );

  // 기대수명 — 土/水 기운
  const lifespan = clamp(
    58
    + ohaeng['土'] * 0.32
    + ohaeng['水'] * 0.18
    + ((spouseOhaeng === '土' || spouseOhaeng === '水') ? spouseEnergy * 0.18 : spouseEnergy * 0.05)
    + (dayJiOhaeng === '土' ? 9 : dayJiOhaeng === '水' ? 7 : 0)
    + (yongShin.isGangShin ? 5 : 0)
    + (yongShin.yongShin === '土' || yongShin.yongShin === '水' ? 5 : 0)
  );

  // 유머 — 火/木 기운, 식상
  const humor = clamp(
    45
    + ohaeng['火'] * 0.40
    + ohaeng['木'] * 0.12
    + (spouseOhaeng === '火' ? spouseEnergy * 0.20 : spouseEnergy * 0.04)
    + (dayJiOhaeng === '火' ? 12 : 0)
    + (hasSS(shinShinMap, '식신', '상관') ? 10 : 0)
    + (!yongShin.isGangShin ? 4 : 0)
  );

  // 테토/에겐 판정
  // 테토: 주도적·카리스마·결단력 / 에겐: 다정함·섬세함·배려
  let tetoScore = 0;
  if (gender === '여') {
    if (hasSS(shinShinMap, '편관')) tetoScore += 3;  // 편관=강한 인연
    if (hasSS(shinShinMap, '정관')) tetoScore -= 2;  // 정관=온화한 인연
  } else {
    if (hasSS(shinShinMap, '편재')) tetoScore += 3;  // 편재=활동적 인연
    if (hasSS(shinShinMap, '정재')) tetoScore -= 2;  // 정재=안정적 인연
  }
  if (spouseOhaeng === '火' || spouseOhaeng === '木') tetoScore += 2;
  else if (spouseOhaeng === '水' || spouseOhaeng === '土') tetoScore -= 2;
  if (dayJiAttr.eumyang === '陽') tetoScore += 1;
  else tetoScore -= 1;

  const tetoEgen: '테토' | '에겐' = tetoScore > 0 ? '테토' : '에겐';
  // 배우자 성별은 본인과 반대
  const spouseIsFemale = gender === '남';
  const faceMap = spouseIsFemale ? JIJI_FACE_FEMALE : JIJI_FACE_MALE;
  const faceType = faceMap[pillars.day.ji] ?? '강아지상';

  const spouseGender = gender === '남' ? '배우자(여성)' : '배우자(남성)';
  const ohaengNames: Record<OHaeng, string> = {
    '木': '목(木)', '火': '화(火)', '土': '토(土)', '金': '금(金)', '水': '수(水)',
  };

  const WEALTH_TEXTS: Record<OHaeng, string> = {
    '木': `${spouseGender}는 재물보다 성장과 도전을 추구하는 타입입니다. 안정적 재력보다는 창업·개척으로 점차 재산을 키워가는 방식을 선호하며, 함께 일구어나가는 동반 성장형 재물운을 가집니다.`,
    '火': `${spouseGender}는 활발한 활동력과 열정으로 수입을 창출하는 능력이 있습니다. 영업·마케팅·투자 방면에서 발군의 감각을 보이며, 한번 기회를 잡으면 빠르게 재력을 끌어올리는 힘이 있습니다.`,
    '土': `${spouseGender}는 꾸준하고 안정적인 재물 관리 능력을 갖추고 있습니다. 부동산·저축·장기 투자 등 탄탄한 기반을 다지는 방식으로 재력을 키우며, 가정의 경제적 안정을 누구보다 중시합니다.`,
    '金': `${spouseGender}는 금전 감각이 뛰어나고 재력 면에서 탄탄한 기반을 갖출 가능성이 높습니다. 실력과 성과에 따른 정직한 수입을 추구하며, 계획적인 소비와 투자로 자산을 체계적으로 관리합니다.`,
    '水': `${spouseGender}는 지혜로운 판단으로 재물을 유연하게 운용하는 능력이 있습니다. 흐르는 물처럼 기회를 포착하고, 다양한 분야의 수입원을 만들어가는 영리한 재물관을 가지고 있습니다.`,
  };

  const ABILITY_TEXTS: Record<OHaeng, string> = {
    '木': `${spouseGender}는 진취적이고 창의적인 능력을 갖추고 있습니다. 기획·예술·교육 등 새로운 아이디어를 펼치는 분야에서 두각을 나타내며, 지속적으로 성장하려는 의지가 강합니다.`,
    '火': `${spouseGender}는 열정과 추진력이 뛰어나 빠르게 성과를 내는 능력이 있습니다. 리더십이 강하고 변화에 민첩하게 대응하며, 사람을 이끌고 동기부여하는 일에서 탁월한 역량을 발휘합니다.`,
    '土': `${spouseGender}는 실용적이고 신뢰감 있는 능력을 갖추고 있습니다. 꾸준한 노력으로 자리를 잡아가며, 책임감 있게 맡은 일을 완성하는 능력이 주변의 인정을 받습니다.`,
    '金': `${spouseGender}는 분석력과 결단력이 뛰어난 능력을 갖추고 있습니다. 법·금융·공학 등 전문 분야에서 두각을 나타내며, 높은 기준을 스스로 세우고 그에 맞게 행동합니다.`,
    '水': `${spouseGender}는 깊은 통찰력과 유연한 사고로 문제를 해결하는 능력이 있습니다. 연구·분석·전략 기획 등 지적 능력을 요하는 분야에서 탁월한 성과를 내는 두뇌파입니다.`,
  };

  const AFFECTION_TEXTS: Record<OHaeng, string> = {
    '木': `${spouseGender}는 따뜻하고 배려심 있는 성격으로, 상대방의 성장을 진심으로 응원합니다. 표현이 직접적이지 않아도 행동으로 사랑을 전달하며, 함께 있으면 자연스럽게 편안함을 느끼게 해줍니다.`,
    '火': `${spouseGender}는 감정 표현이 풍부하고 애정이 넘치는 성격입니다. 소중한 사람에게 솔직하게 마음을 전달하며, 함께 있을 때 긍정적인 에너지를 아낌없이 나누어주는 스타일입니다.`,
    '土': `${spouseGender}는 든든하고 안정적인 다정함을 가지고 있습니다. 말보다 행동으로 애정을 표현하며, 힘들 때 묵묵히 곁에 있어 주는 믿음직스러운 파트너가 됩니다.`,
    '金': `${spouseGender}는 원칙적이지만 깊은 내면에 따뜻함을 품고 있습니다. 한번 마음을 연 상대에게는 지극히 헌신적이며, 약속을 반드시 지키는 신뢰감 있는 파트너입니다.`,
    '水': `${spouseGender}는 섬세하고 공감 능력이 뛰어난 다정함을 가지고 있습니다. 상대방의 감정을 잘 읽고 알맞은 위로와 공감을 전달하며, 정신적 유대감이 깊습니다.`,
  };

  const LIFESPAN_TEXTS: Record<OHaeng, string> = {
    '木': `${spouseGender}는 활동적이고 자연과 가까운 생활로 건강을 유지하는 타입입니다. 규칙적인 운동과 긍정적인 마인드가 건강 유지의 비결이며, 성장 욕구가 삶의 활력을 꾸준히 불어넣습니다.`,
    '火': `${spouseGender}는 열정적인 생활 에너지를 바탕으로 활기찬 건강을 유지합니다. 다만 과로에 주의하고 충분한 휴식을 취할 때 더욱 건강하게 오래 함께할 수 있습니다.`,
    '土': `${spouseGender}는 안정적인 생활 습관으로 건강을 유지하는 타입입니다. 규칙적인 식사와 충분한 수면을 중시하며, 중심을 잡아주는 토(土) 기운으로 든든한 체력을 자랑합니다.`,
    '金': `${spouseGender}는 규율과 절제로 건강을 관리하는 타입입니다. 자기 관리 능력이 뛰어나고 건강에 대한 기준이 높아, 꾸준한 관리로 장수하는 경향이 있습니다.`,
    '水': `${spouseGender}는 유연하고 지혜로운 생활로 건강을 유지합니다. 물 흐르듯 자연스러운 생활 리듬을 유지하는 것이 장수의 비결이며, 정신 건강 관리와 감수성 조절이 중요합니다.`,
  };

  const HUMOR_TEXTS: Record<OHaeng, string> = {
    '木': `${spouseGender}는 톡톡 튀는 아이디어와 유쾌한 발상으로 웃음을 주는 타입입니다. 상황을 긍정적으로 해석하는 능력이 있어, 함께 있으면 자연스럽게 미소 짓게 되는 매력이 있습니다.`,
    '火': `${spouseGender}는 밝고 에너지 넘치는 유머 감각을 가지고 있습니다. 분위기를 살리는 능력이 탁월하고, 재치 있는 말 한마디로 주변을 웃게 만드는 타고난 엔터테이너입니다.`,
    '土': `${spouseGender}는 소박하고 진심 어린 유머를 즐깁니다. 과장 없이 자연스럽게 웃음을 만들어내며, 편안하고 따뜻한 분위기 속에서 소소한 행복을 나누는 스타일입니다.`,
    '金': `${spouseGender}는 날카롭고 위트 있는 유머 감각을 가지고 있습니다. 상황을 정확하게 포착해 한마디로 웃음을 만들어내며, 예상치 못한 타이밍에 웃음을 주는 매력이 있습니다.`,
    '水': `${spouseGender}는 깊이 있고 지적인 유머를 즐깁니다. 번뜩이는 통찰력으로 상황을 재미있게 해석하며, 이야기를 나눌수록 더욱 매력적인 유머 감각이 빛을 발합니다.`,
  };

  const tetoEgenDesc = tetoEgen === '테토'
    ? '주도적이고 자신감 넘치는 성격으로, 관계에서 먼저 이끌어가는 역할을 즐깁니다. 카리스마 있고 결단력이 강해 함께 있으면 든든한 느낌을 줍니다'
    : '다정하고 섬세한 성격으로, 상대방의 감정을 잘 읽고 세심하게 배려합니다. 부드럽고 안정적인 분위기를 만들어 함께 있으면 편안함을 느끼게 해줍니다';

  const ohaengSpecial: Record<OHaeng, string> = {
    '木': '창의적이고 진취적인 면이 있으며, 새로운 도전을 두려워하지 않습니다',
    '火': '열정적이고 밝은 에너지로 주변을 활기차게 만드는 매력이 있습니다',
    '土': '믿음직하고 안정적인 성격으로, 언제나 곁에서 든든한 버팀목이 되어줍니다',
    '金': '원칙적이고 책임감이 강하며, 한번 마음먹은 것은 끝까지 지키는 의리가 있습니다',
    '水': '깊은 감수성과 지혜로 상황을 유연하게 헤쳐나가는 능력이 있습니다',
  };

  const specialChars = `${ohaengSpecial[spouseOhaeng]}. ${tetoEgenDesc}. 외모적으로는 ${faceType}의 특징이 나타날 가능성이 높습니다.`;

  return {
    wealth,
    ability,
    affection,
    lifespan,
    humor,
    faceType,
    tetoEgen,
    spouseOhaeng: ohaengNames[spouseOhaeng],
    wealthText: WEALTH_TEXTS[spouseOhaeng],
    abilityText: ABILITY_TEXTS[spouseOhaeng],
    affectionText: AFFECTION_TEXTS[spouseOhaeng],
    lifespanText: LIFESPAN_TEXTS[spouseOhaeng],
    humorText: HUMOR_TEXTS[spouseOhaeng],
    specialChars,
  };
}
