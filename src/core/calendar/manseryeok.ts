import type { SajuInput, SajuResult, ShinShinMap } from '@/store/types';
import { computePillars, isForwardDaeun } from '@/core/saju/pillar';
import { computeOhaeng, computeYongShin, computeStrength } from '@/core/saju/ohaeng';
import { detectRelations } from '@/core/saju/relations';
import { getShinShin } from '@/core/saju/sinshin';
import { calcDaeunStartAge } from '@/core/daeun/daeunStart';
import { buildDaeunList, getCurrentDaeun } from '@/core/daeun/daeunList';
import { getTaeseGanJi } from '@/core/seun/taeseGanji';
import { getWolgeonSimple } from '@/core/seun/wolgeon';
import { getSajuYearAndMonthIndex } from '@/core/calendar/julgi';
import { CHEONGAN_ORDER, MONTH_JIJI } from '@/core/saju/ganji';
import { getPersonalityText } from '@/core/interpretation/personality';
import { getCareerText } from '@/core/interpretation/career';
import { computeSpouseStats } from '@/core/interpretation/romance';

/** 만세력 메인 연산 진입점 */
export function computeSajuResult(input: SajuInput): SajuResult {
  const pillars = computePillars({
    year: input.birthYear, month: input.birthMonth, day: input.birthDay,
    hour: input.birthHour, minute: input.birthMinute,
    isLunar: input.isLunar, isLeapMonth: input.isLeapMonth,
  });

  const ohaeng = computeOhaeng(pillars);
  const yongShin = computeYongShin(pillars);
  const relations = detectRelations(pillars);

  // 십신 맵
  const dayGan = pillars.day.gan;
  const allGans = [pillars.year.gan, pillars.month.gan, pillars.day.gan];
  if (pillars.hour) allGans.push(pillars.hour.gan);
  const shinShinMap: ShinShinMap = {};
  for (const g of allGans) {
    if (g !== dayGan) shinShinMap[g] = getShinShin(dayGan, g);
  }

  // 대운
  const forward = isForwardDaeun(pillars.year.gan, input.gender);
  const { startAge, isForward, daysDiff } = calcDaeunStartAge(
    input.birthYear, input.birthMonth, input.birthDay,
    input.birthHour ?? 12, pillars.year.gan, input.gender
  );
  void daysDiff;

  const daeunList = buildDaeunList(pillars, startAge, isForward);
  const currentYear = new Date().getFullYear();
  const currentDaeun = getCurrentDaeun(daeunList, input.birthYear, currentYear);

  // 세운·월운
  const currentYearGanJi = getTaeseGanJi(currentYear);
  const today = new Date();
  const { sajuYear: cSajuYear, monthJijiIndex: cMonthIdx } = getSajuYearAndMonthIndex(
    today.getFullYear(), today.getMonth() + 1, today.getDate(), 12, 0
  );
  const cYearGan = CHEONGAN_ORDER[((cSajuYear - 1984) % 10 + 10) % 10];
  const currentMonthGanJi = getWolgeonSimple(cYearGan, cMonthIdx);

  const { text: strengthText } = computeStrength(pillars);
  const personalityText = getPersonalityText(pillars, yongShin);
  const careerText = getCareerText(pillars, yongShin, ohaeng);
  const spouseStats = computeSpouseStats(pillars, input.gender, ohaeng, yongShin, shinShinMap);

  return {
    input,
    pillars,
    ohaeng,
    yongShin,
    daeunList,
    daeunStartAge: startAge,
    isForward,
    currentDaeun,
    currentYear: currentYearGanJi,
    currentMonth: currentMonthGanJi,
    relations,
    shinShinMap,
    personalityText,
    careerText,
    spouseStats,
    strengthText,
  };
}
