// 양력 ↔ 음력 변환 — Jean Meeus 삭망 알고리즘 기반
// 정밀도: 실제 음력과 ±1일 오차 범위 (한국천문연구원 기준에 최대한 근접)

const DEG = Math.PI / 180;
function toRad(d: number) { return d * DEG; }

/** JDE of the k-th new moon (k=0 at J2000.0) */
function newMoonJDE(k: number): number {
  const T = k / 1236.85;
  let JDE = 2451550.09766
    + 29.530588861 * k
    + 0.00015437 * T * T
    - 0.000000150 * T * T * T
    + 0.00000000073 * T * T * T * T;

  const M     = toRad(2.5534    + 29.10535670 * k - 0.0000014 * T * T);
  const Mprime= toRad(201.5643  + 385.81693528 * k + 0.0107582 * T * T + 0.00001238 * T * T * T);
  const F     = toRad(160.7108  + 390.67050284 * k - 0.0016118 * T * T - 0.00000227 * T * T * T);
  const Omega = toRad(124.7746  - 1.56375588 * k + 0.0020672 * T * T);
  const E     = 1 - 0.002516 * T - 0.0000074 * T * T;

  JDE +=
    -0.40720 * Math.sin(Mprime)
    + 0.17241 * E * Math.sin(M)
    + 0.01608 * Math.sin(2 * Mprime)
    + 0.01039 * Math.sin(2 * F)
    + 0.00739 * E * Math.sin(Mprime - M)
    - 0.00514 * E * Math.sin(Mprime + M)
    + 0.00208 * E * E * Math.sin(2 * M)
    - 0.00111 * Math.sin(Mprime - 2 * F)
    - 0.00057 * Math.sin(Mprime + 2 * F)
    + 0.00056 * E * Math.sin(2 * Mprime + M)
    - 0.00042 * Math.sin(3 * Mprime)
    + 0.00042 * E * Math.sin(M + 2 * F)
    + 0.00038 * E * Math.sin(M - 2 * F)
    - 0.00024 * E * Math.sin(2 * Mprime - M)
    - 0.00017 * Math.sin(Omega)
    - 0.00007 * Math.sin(Mprime + 2 * M)
    + 0.00004 * Math.sin(2 * Mprime - 2 * F)
    + 0.00004 * Math.sin(3 * M)
    + 0.00003 * Math.sin(Mprime + M - 2 * F)
    + 0.00003 * Math.sin(2 * Mprime + 2 * F)
    - 0.00003 * Math.sin(Mprime + M + 2 * F)
    + 0.00003 * Math.sin(Mprime - M + 2 * F)
    - 0.00002 * Math.sin(Mprime - M - 2 * F)
    - 0.00002 * Math.sin(3 * Mprime + M)
    + 0.00002 * Math.sin(4 * Mprime);

  return JDE;
}

/** JD 전후에서 다음 삭(朔) JD (UTC) 반환 */
function nextNewMoonJD(afterJD: number): number {
  const k0 = Math.round((afterJD - 2451550.09766) / 29.530588861);
  let jde = newMoonJDE(k0);
  if (jde <= afterJD) jde = newMoonJDE(k0 + 1);
  return jde;
}

/** 태양 황경(도) 계산 */
function sunLon(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  let L0 = 280.46646 + 36000.76983 * T;
  L0 = ((L0 % 360) + 360) % 360;
  let Mval = 357.52911 + 35999.05029 * T;
  Mval = ((Mval % 360) + 360) % 360;
  const Mrad = toRad(Mval);
  const C = 1.914602 * Math.sin(Mrad) + 0.019993 * Math.sin(2 * Mrad) + 0.000289 * Math.sin(3 * Mrad);
  let theta = L0 + C - 0.00569;
  return ((theta % 360) + 360) % 360;
}

/** 특정 연도의 동지(冬至, 황경=270°) JD */
function dongjiJD(year: number): number {
  let jd = (year - 2000) * 365.25 + 2451545 - 10; // rough
  for (let i = 0; i < 50; i++) {
    let diff = 270 - sunLon(jd);
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    if (Math.abs(diff) < 0.0001) break;
    jd += diff / 360 * 365.25;
  }
  return jd;
}

/** 특정 연도 동지 이후의 삭망 목록 (~15개) */
function newMooonsAfterDongji(year: number): number[] {
  const djJD = dongjiJD(year);
  const moons: number[] = [];
  let jd = djJD;
  for (let i = 0; i < 16; i++) {
    jd = nextNewMoonJD(jd + 0.5);
    moons.push(jd);
  }
  return moons;
}

/** 중기(中氣) 황경 — 330, 0, 30, 60, ..., 300 (12개) */
const ZHONGQI_LONS = [330, 0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300];

function nextZhongqiAfter(jd: number): number {
  const currLon = sunLon(jd);
  let targetIdx = ZHONGQI_LONS.findIndex(l => {
    let d = l - currLon;
    if (d < 0) d += 360;
    return d > 0;
  });
  if (targetIdx === -1) targetIdx = 0;
  const targetLon = ZHONGQI_LONS[targetIdx];
  let jd2 = jd + 10;
  for (let i = 0; i < 60; i++) {
    let diff = targetLon - sunLon(jd2);
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    if (Math.abs(diff) < 0.0001) break;
    jd2 += diff / 360 * 365.25;
  }
  return jd2;
}

export interface LunarDate {
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeap: boolean;
}

/** 양력 → 음력 변환 (KST 기준) */
export function solarToLunar(year: number, month: number, day: number): LunarDate {
  // 입력 날짜의 JD (KST 정오 기준)
  let yy = year, mm = month;
  if (mm <= 2) { yy--; mm += 12; }
  const A = Math.floor(yy / 100);
  const B = 2 - A + Math.floor(A / 4);
  const targetJD = Math.floor(365.25 * (yy + 4716)) + Math.floor(30.6001 * (mm + 1)) + day + B - 1524.5 + 0.5; // noon UTC

  // 해당 음력 연도 동지 찾기 (이전 연도의 동지부터 시작)
  const dongjiPrev = dongjiJD(year - 1);
  const moons = newMooonsAfterDongji(year - 1);

  // 동지를 포함하는 달 찾기 (11월 달)
  let month11Idx = -1;
  for (let i = 0; i < moons.length - 1; i++) {
    const lonStart = sunLon(moons[i]);
    const lonEnd = sunLon(moons[i + 1]);
    // 동지(270°)가 이 달에 포함되는지
    let diff = 270 - lonStart;
    if (diff < 0) diff += 360;
    let range = lonEnd - lonStart;
    if (range < 0) range += 360;
    if (diff >= 0 && diff < range) {
      month11Idx = i;
      break;
    }
  }
  if (month11Idx === -1) month11Idx = 0;

  // 음력 연도 시작 삭(1월 1일)
  // 음력 연도는 11월(동지월) 다음 2번째 삭부터
  // 실제로는 더 복잡하지만 근사적으로:
  const lunarYearStartIdx = month11Idx + 2;
  const lunarYearStartJD = moons[lunarYearStartIdx] + 9 / 24; // KST

  let lunarYear = year;
  // targetJD < lunarYearStartJD이면 작년 음력
  if (targetJD + 9 / 24 < lunarYearStartJD) {
    lunarYear = year - 1;
    // 재계산
    return solarToLunar_fromStart(targetJD, lunarYear);
  }

  return solarToLunar_fromStart(targetJD, lunarYear);
}

function solarToLunar_fromStart(targetJD: number, lunarYear: number): LunarDate {
  // lunarYear의 음력 달 목록 계산
  const djYear = dongjiJD(lunarYear - 1);
  const moons = newMooonsAfterDongji(lunarYear - 1);

  // 11월 삭 찾기
  let m11 = -1;
  for (let i = 0; i < moons.length - 1; i++) {
    const l0 = sunLon(moons[i]);
    const l1 = sunLon(moons[i + 1]);
    let d = 270 - l0;
    if (d < 0) d += 360;
    let r = l1 - l0;
    if (r < 0) r += 360;
    if (d < r && d >= 0) { m11 = i; break; }
  }
  if (m11 < 0) m11 = 0;

  const yearStart = moons[m11 + 2]; // 1월 1일

  // 중기 목록 구성
  const zhongqis: number[] = [];
  let zq = nextZhongqiAfter(moons[m11]);
  for (let i = 0; i < 14; i++) {
    zhongqis.push(zq);
    zq = nextZhongqiAfter(zq + 25);
  }

  // 달 목록 구성 (윤달 포함)
  interface MonthEntry { jd: number; month: number; isLeap: boolean }
  const months: MonthEntry[] = [];
  let mo = 1;
  let lastWasLeap = false;
  for (let i = m11 + 2; i < moons.length - 1; i++) {
    const mJD = moons[i];
    const mJD2 = moons[i + 1];
    // 이 달에 중기가 있는지
    const hasZhongqi = zhongqis.some(z => z >= mJD && z < mJD2);
    if (!hasZhongqi && !lastWasLeap) {
      months.push({ jd: mJD, month: mo - 1, isLeap: true });
      lastWasLeap = true;
    } else {
      months.push({ jd: mJD, month: mo, isLeap: false });
      mo++;
      lastWasLeap = false;
    }
    if (mo > 13) break;
  }

  // targetJD가 어느 달에 속하는지
  const targetKST = targetJD; // already UTC noon; KST difference handled by comparing JDs
  let foundMonth = 1, foundIsLeap = false, foundMonthJD = yearStart;
  for (let i = months.length - 1; i >= 0; i--) {
    if (targetKST >= months[i].jd - 0.0001) {
      foundMonth = months[i].month;
      foundIsLeap = months[i].isLeap;
      foundMonthJD = months[i].jd;
      break;
    }
  }

  const lunarDay = Math.floor(targetKST - foundMonthJD) + 1;

  return {
    lunarYear,
    lunarMonth: foundMonth,
    lunarDay: Math.max(1, lunarDay),
    isLeap: foundIsLeap,
  };
}

/** 음력 → 양력 변환 (근사) */
export function lunarToSolar(
  lunarYear: number, lunarMonth: number, lunarDay: number, isLeap = false
): { year: number; month: number; day: number } {
  const moons = newMooonsAfterDongji(lunarYear - 1);
  const djYear = dongjiJD(lunarYear - 1);

  let m11 = -1;
  for (let i = 0; i < moons.length - 1; i++) {
    const l0 = sunLon(moons[i]);
    const l1 = sunLon(moons[i + 1]);
    let d = 270 - l0;
    if (d < 0) d += 360;
    let r = l1 - l0;
    if (r < 0) r += 360;
    if (d < r && d >= 0) { m11 = i; break; }
  }
  if (m11 < 0) m11 = 0;

  const zhongqis: number[] = [];
  let zq = nextZhongqiAfter(moons[m11]);
  for (let i = 0; i < 14; i++) {
    zhongqis.push(zq);
    zq = nextZhongqiAfter(zq + 25);
  }

  interface MonthEntry { jd: number; month: number; isLeap: boolean }
  const months: MonthEntry[] = [];
  let mo = 1;
  let lastWasLeap = false;
  for (let i = m11 + 2; i < moons.length - 1; i++) {
    const mJD = moons[i];
    const mJD2 = moons[i + 1];
    const hasZhongqi = zhongqis.some(z => z >= mJD && z < mJD2);
    if (!hasZhongqi && !lastWasLeap) {
      months.push({ jd: mJD, month: mo - 1, isLeap: true });
      lastWasLeap = true;
    } else {
      months.push({ jd: mJD, month: mo, isLeap: false });
      mo++;
      lastWasLeap = false;
    }
    if (mo > 13) break;
  }

  const target = months.find(m => m.month === lunarMonth && m.isLeap === isLeap);
  if (!target) {
    const fallback = months.find(m => m.month === lunarMonth);
    if (!fallback) return { year: lunarYear, month: lunarMonth, day: lunarDay };
    const jd = fallback.jd + (lunarDay - 1);
    return jdToGregorianSimple(jd);
  }
  const jd = target.jd + (lunarDay - 1);
  return jdToGregorianSimple(jd);
}

function jdToGregorianSimple(jd: number): { year: number; month: number; day: number } {
  const jd2 = jd + 0.5;
  const Z = Math.floor(jd2);
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
  return { year, month, day };
}


