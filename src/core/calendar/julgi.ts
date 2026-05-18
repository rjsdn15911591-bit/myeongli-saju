// 절기(節氣) 천문 계산 — Jean Meeus "Astronomical Algorithms" 기반
// 한국표준시(KST = UTC+9) 기준으로 반환

const DEG = Math.PI / 180;

function toRad(d: number) { return d * DEG; }
function normalizeAngle(a: number) { return ((a % 360) + 360) % 360; }

/** 그레고리력 날짜를 율리우스일(JD)로 변환 */
function gregorianToJD(year: number, month: number, day: number, hourUTC = 0): number {
  let y = year, m = month;
  if (m <= 2) { y--; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + hourUTC / 24 + B - 1524.5;
}

/** JD를 그레고리력으로 변환 */
export function jdToGregorian(jd: number): { year: number; month: number; day: number; hour: number } {
  const jd2 = jd + 0.5;
  const Z = Math.floor(jd2);
  const F = jd2 - Z;
  let A = Z;
  if (Z >= 2299161) {
    const alpha = Math.floor((Z - 1867216.25) / 36524.25);
    A = Z + 1 + alpha - Math.floor(alpha / 4);
  }
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);
  const day = B - D - Math.floor(30.6001 * E);
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;
  const hour = F * 24;
  return { year, month, day, hour };
}

/** 태양 황경(도) 계산 — 율리우스일 기준 */
function sunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  let L0 = normalizeAngle(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  let M  = normalizeAngle(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mrad = toRad(M);
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad)
           + (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad)
           + 0.000289 * Math.sin(3 * Mrad);
  let theta = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  theta = theta - 0.00569 - 0.00478 * Math.sin(toRad(omega));
  return normalizeAngle(theta);
}

/** 목표 황경에 도달하는 JD (KST 반환) — Newton-Raphson 반복 */
function findSolarTermJD(approxJD: number, targetLon: number): number {
  let jd = approxJD;
  for (let i = 0; i < 50; i++) {
    let diff = targetLon - sunLongitude(jd);
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    if (Math.abs(diff) < 0.000001) break;
    jd += diff / 360 * 365.25;
  }
  // UTC → KST (+9h)
  return jd + 9 / 24;
}

// 12 절(節) — 사주 월 경계 (황경, 월지지 인덱스 0=寅)
const JULGI_BOUNDARIES: { lon: number; name: string }[] = [
  { lon: 315, name: '입춘' },  // 寅월
  { lon: 345, name: '경칩' },  // 卯월
  { lon:  15, name: '청명' },  // 辰월
  { lon:  45, name: '입하' },  // 巳월
  { lon:  75, name: '망종' },  // 午월
  { lon: 105, name: '소서' },  // 未월
  { lon: 135, name: '입추' },  // 申월
  { lon: 165, name: '백로' },  // 酉월
  { lon: 195, name: '한로' },  // 戌월
  { lon: 225, name: '입동' },  // 亥월
  { lon: 255, name: '대설' },  // 子월
  { lon: 285, name: '소한' },  // 丑월
];

// 대운 계산용 24 절기 (절만 12개, 중기 포함 24개)
export const ALL_JULGI: { lon: number; name: string }[] = [
  { lon: 285, name: '소한' }, { lon: 300, name: '대한' },
  { lon: 315, name: '입춘' }, { lon: 330, name: '우수' },
  { lon: 345, name: '경칩' }, { lon:   0, name: '춘분' },
  { lon:  15, name: '청명' }, { lon:  30, name: '곡우' },
  { lon:  45, name: '입하' }, { lon:  60, name: '소만' },
  { lon:  75, name: '망종' }, { lon:  90, name: '하지' },
  { lon: 105, name: '소서' }, { lon: 120, name: '대서' },
  { lon: 135, name: '입추' }, { lon: 150, name: '처서' },
  { lon: 165, name: '백로' }, { lon: 180, name: '추분' },
  { lon: 195, name: '한로' }, { lon: 210, name: '상강' },
  { lon: 225, name: '입동' }, { lon: 240, name: '소설' },
  { lon: 255, name: '대설' }, { lon: 270, name: '동지' },
];

/** 특정 연도의 절기 JD(KST) 목록 계산 */
function yearJulgiJDs(year: number, terms: { lon: number }[]): number[] {
  return terms.map(({ lon }) => {
    let approxMonth = ((lon - 280) / 30) + 1;
    if (approxMonth < 1) approxMonth += 12;
    // round 전에 12.x 값이 13으로 올림되지 않도록 클램프 (대설 255° 버그 수정)
    const approxMonthInt = Math.min(12, Math.round(approxMonth));
    let approxYear = year;
    // 소한(285°)/대한(300°)은 해당 사주 연도의 다음 양력 1월에 위치
    if (approxMonthInt === 1 && lon < 315) approxYear = year + 1;
    const approxJD = gregorianToJD(approxYear, approxMonthInt, 6);
    return findSolarTermJD(approxJD, lon);
  });
}

/** 입춘 JD(KST) 반환 */
export function getIpchunJD(year: number): number {
  return yearJulgiJDs(year, [{ lon: 315 }])[0];
}

/**
 * 생년월일시를 받아 사주 월주 지지 인덱스(0=寅月) 와 연주 기준 연도 반환
 * @returns { saJuYear, monthJijiIndex }
 *   saJuYear: 사주 연주 기준 연도 (입춘 이전 출생이면 -1)
 *   monthJijiIndex: 0=寅, 1=卯, ... 11=丑
 */
export function getSajuYearAndMonthIndex(
  year: number, month: number, day: number, hour: number, minute: number
): { sajuYear: number; monthJijiIndex: number } {
  // 생일의 JD (KST 기준)
  const birthJD = gregorianToJD(year, month, day) + (hour * 60 + minute) / 1440 + 9 / 24;

  // 입춘 JD for 해당 연도 and 다음 연도
  const ipchunThisYear = getIpchunJD(year);
  const ipchunNextYear = getIpchunJD(year + 1);
  const ipchunPrevYear = getIpchunJD(year - 1);

  // 사주 연주 기준
  let sajuYear: number;
  if (birthJD < ipchunThisYear) {
    sajuYear = year - 1;
  } else if (birthJD >= ipchunNextYear) {
    sajuYear = year + 1;
  } else {
    sajuYear = year;
  }
  void ipchunPrevYear;

  // 월주 지지 계산: 각 절기 JD와 비교
  const julgiJDs = yearJulgiJDs(sajuYear, JULGI_BOUNDARIES);
  // 다음 연도의 첫 두 절기도 필요
  const nextYearFirst2 = yearJulgiJDs(sajuYear + 1, JULGI_BOUNDARIES.slice(0, 2));

  let monthJijiIndex = 11; // 기본: 丑月
  const allBoundaries = [...julgiJDs, ...nextYearFirst2];

  for (let i = allBoundaries.length - 1; i >= 0; i--) {
    if (birthJD >= allBoundaries[i]) {
      monthJijiIndex = i % 12;
      break;
    }
  }

  return { sajuYear, monthJijiIndex };
}

/**
 * 생일에서 가장 가까운 절기까지의 날수 반환 (대운 계산용)
 * @param isForward true면 이후 절기, false면 이전 절기
 */
export function getDaysToNearestJulgi(
  birthJD: number, isForward: boolean
): { days: number; julgiJD: number } {
  // 생년 추정
  const { year } = jdToGregorian(birthJD);
  const range = [-1, 0, 1];
  let allJDs: number[] = [];
  for (const dy of range) {
    allJDs = allJDs.concat(yearJulgiJDs(year + dy, ALL_JULGI));
  }
  allJDs.sort((a, b) => a - b);

  if (isForward) {
    const next = allJDs.find(jd => jd > birthJD);
    if (!next) return { days: 0, julgiJD: birthJD };
    return { days: Math.abs(next - birthJD), julgiJD: next };
  } else {
    const prev = [...allJDs].reverse().find(jd => jd <= birthJD);
    if (!prev) return { days: 0, julgiJD: birthJD };
    return { days: Math.abs(birthJD - prev), julgiJD: prev };
  }
}
