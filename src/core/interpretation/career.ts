import type { SaJuPillar, YongShin, OHaengDistribution, OHaeng } from '@/store/types';
import { CHEONGAN_ATTR } from '@/core/saju/ganji';

const OHAENG_JOBS: Record<OHaeng, string[]> = {
  '木': ['교육·강의', '출판·언론', '법률·행정', '의료(한의학)', '환경·산림', '기획·연구', '컨설팅'],
  '火': ['IT·전자', '방송·연예·미디어', '마케팅·홍보', '의료(외과·안과)', '금융투자', '에너지·화학'],
  '土': ['부동산·건설', '농업·식품', '공무원·행정', '물류·유통', '중재·조정', '교육(초등·유아)'],
  '金': ['금융·증권', '법률·사법', '군·경찰', '제조·기계', '의료(치과·정형)', '컨설팅·감사'],
  '水': ['무역·해외', '물류·여행', '예술·창작', '철학·상담', 'IT·소통', '의료(내과·정신건강)'],
};

const BUSINESS_VS_EMPLOYMENT: Record<OHaeng, string> = {
  '木': '독립적 기질이 강해 창업·프리랜서 방향에서 두각을 나타내는 경향이 있습니다.',
  '火': '적극적 영업력과 사교력으로 영업·창업에서 성과를 내는 편입니다.',
  '土': '안정적이고 신뢰받는 직장생활에서 꾸준한 성장을 이루는 경향이 있습니다.',
  '金': '원칙과 규율을 중시하여 공직·대기업·전문직에서 인정받는 편입니다.',
  '水': '변화 적응력이 높아 다양한 경험을 쌓는 커리어 경로가 잘 맞습니다.',
};

export function getCareerText(
  pillars: SaJuPillar, yongShin: YongShin, ohaeng: OHaengDistribution
): string {
  const dayGan = pillars.day.gan;
  const dayOhaeng = CHEONGAN_ATTR[dayGan].ohaeng;
  const yongOhaeng = yongShin.yongShin;

  const combined = OHAENG_JOBS[yongOhaeng].concat(OHAENG_JOBS[dayOhaeng]);
  const jobs = combined.filter((v, i, a) => a.indexOf(v) === i).slice(0, 6);
  const jobList = jobs.join(', ');
  const bvse = BUSINESS_VS_EMPLOYMENT[dayOhaeng];

  const dominant = (Object.entries(ohaeng) as [OHaeng, number][])
    .sort((a, b) => b[1] - a[1])[0][0];

  const reText = yongShin.isGangShin
    ? `신강 사주이므로 에너지를 발산하는 역동적 직종이나 독립적 업무 환경이 유리합니다.`
    : `신약 사주이므로 안정적인 조직 내에서 전문성을 쌓는 방향이 유리합니다.`;

  return `용신 오행(${yongOhaeng})과 일간 오행(${dayOhaeng})을 바탕으로 적성 직업군을 살펴보면 ${jobList} 등의 분야가 잘 맞을 수 있습니다.\n\n${bvse}\n\n${reText}\n\n재성(財星)으로 보면 오행 분포상 ${dominant} 기운이 가장 강하게 나타나므로, 이 오행의 특성을 살린 분야에서 재물 운이 열릴 가능성이 높습니다.`;
}
