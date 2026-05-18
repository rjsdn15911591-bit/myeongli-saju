# 命理 사주 — 기술 요구사항 명세서 (TRD)

| 항목 | 내용 |
|------|------|
| 문서 버전 | v1.0 |
| 작성일 | 2026-05-17 |
| 제품명 | 命理 사주 (Myeongli Saju) |
| 문서 유형 | Technical Requirements Document |
| 관련 문서 | `saju-design-prompt.md`, `PRD.md` |

---

## 1. 기술 스택 개요

### 1.1 아키텍처 원칙
- **완전 클라이언트 사이드 실행:** 개인정보(생년월일) 보호를 위해 모든 명리 계산을 브라우저에서 실행. 백엔드 서버 불필요(정적 호스팅).
- **의존성 최소화:** 핵심 계산 로직은 순수 JavaScript/TypeScript로 구현. 외부 API 호출 없음.
- **폰트 완결성:** LXGWWenKaiKR 3종을 자체 호스팅. 외부 폰트 CDN 의존 없음.

### 1.2 기술 스택

| 레이어 | 기술 선택 | 선택 근거 |
|--------|---------|---------|
| 프레임워크 | **Next.js 14+ (App Router)** | SSG 정적 배포 + SEO + React 생태계 |
| 언어 | **TypeScript** | 명리 계산 로직 타입 안전성 필수 |
| 스타일 | **CSS Modules + CSS Variables** | 디자인 토큰 시스템 완벽 구현, Zero runtime |
| 상태 관리 | **Zustand** | 사주 입력→결과 전역 상태 경량 관리 |
| 차트·시각화 | **D3.js (경량 선택 import)** | 오행 비율 바, 대운 타임라인 커스텀 렌더링 |
| 테스트 | **Vitest + Testing Library** | 명리 계산 로직 단위 테스트 필수 |
| 배포 | **Vercel (또는 GitHub Pages)** | Next.js SSG 정적 배포 최적화 |

---

## 2. 디렉터리 구조

```
myeongli-saju/
├── public/
│   ├── fonts/
│   │   ├── LXGWWenKaiKR-Light.ttf
│   │   ├── LXGWWenKaiKR-Regular.ttf
│   │   └── LXGWWenKaiKR-Medium.ttf
│   └── favicon.ico
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # 루트 레이아웃 (폰트 preload, 글로벌 CSS)
│   │   ├── page.tsx                  # 홈 (랜딩 + 입력 폼)
│   │   ├── result/
│   │   │   └── page.tsx              # 결과 페이지
│   │   ├── glossary/
│   │   │   └── page.tsx              # 용어 사전
│   │   └── about/
│   │       └── page.tsx              # 서비스 소개
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── GlobalNav.tsx         # 상단 내비 (void-black)
│   │   │   ├── SubNav.tsx            # 毛玻璃 서브 내비
│   │   │   ├── Footer.tsx            # 푸터
│   │   │   └── FloatingBar.tsx       # 플로팅 결과 바
│   │   │
│   │   ├── input/
│   │   │   ├── SajuInputForm.tsx     # 사주 입력 폼 전체
│   │   │   ├── DatePicker.tsx        # 생년월일 선택
│   │   │   ├── TimePicker.tsx        # 시간 선택 (12지지)
│   │   │   └── LunarToggle.tsx       # 양력/음력 전환
│   │   │
│   │   ├── result/
│   │   │   ├── SajuCard.tsx          # 命盤 카드 (핵심)
│   │   │   ├── OhaengChart.tsx       # 오행 분포 차트
│   │   │   ├── ShinSinGrid.tsx       # 십신 그리드
│   │   │   ├── DaeunTimeline.tsx     # 대운 타임라인
│   │   │   ├── SeunPanel.tsx         # 세운·월운·일운
│   │   │   ├── DailyCalendar.tsx     # 일운 달력
│   │   │   └── ReportSection.tsx     # 종합 해석 리포트
│   │   │
│   │   └── common/
│   │       ├── Button.tsx            # 버튼 (primary/secondary/utility)
│   │       ├── Pill.tsx              # pill 입력·배지
│   │       ├── Tooltip.tsx           # 용어 툴팁
│   │       └── HanjaGlyph.tsx        # 한자 장식 래퍼 (aria-hidden 자동)
│   │
│   ├── core/                         # 명리 계산 순수 로직 (UI 의존 없음)
│   │   ├── calendar/
│   │   │   ├── solarLunar.ts         # 양력↔음력 변환
│   │   │   ├── julgiBoundary.ts      # 절기 경계 데이터 및 조회
│   │   │   └── manseryeok.ts         # 만세력 메인 진입점
│   │   │
│   │   ├── saju/
│   │   │   ├── pillar.ts             # 4주(연월일시) 천간·지지 산출
│   │   │   ├── ganji.ts              # 천간·지지 상수 및 속성
│   │   │   ├── jijanggan.ts          # 지장간 테이블
│   │   │   ├── sinshin.ts            # 십신 계산
│   │   │   ├── relations.ts          # 합·충·형·파·해 감지
│   │   │   └── ohaeng.ts             # 오행 분포·강약·용신
│   │   │
│   │   ├── daeun/
│   │   │   ├── daeunStart.ts         # 대운 수(起大運數) 계산
│   │   │   └── daeunList.ts          # 전체 대운 목록 생성
│   │   │
│   │   ├── seun/
│   │   │   ├── taeseGanji.ts         # 태세(太歲) 천간·지지
│   │   │   └── wolgeon.ts            # 월건(月建) 계산
│   │   │
│   │   └── interpretation/
│   │       ├── personality.ts        # 성격·기질 해석 텍스트 매핑
│   │       ├── career.ts             # 직업·재물 해석 텍스트 매핑
│   │       ├── health.ts             # 건강 해석 텍스트 매핑
│   │       └── relationship.ts       # 인간관계 해석 텍스트 매핑
│   │
│   ├── store/
│   │   ├── sajuStore.ts              # Zustand 전역 스토어
│   │   └── types.ts                  # 공통 타입 정의
│   │
│   ├── styles/
│   │   ├── globals.css               # CSS 변수 토큰 전체 정의
│   │   ├── fonts.css                 # @font-face 선언
│   │   └── reset.css                 # CSS 리셋
│   │
│   └── utils/
│       ├── share.ts                  # 공유 URL 인코딩/디코딩
│       ├── print.ts                  # 인쇄 레이아웃 헬퍼
│       └── a11y.ts                   # 접근성 유틸
│
├── tests/
│   ├── core/                         # 명리 계산 단위 테스트
│   │   ├── pillar.test.ts
│   │   ├── relations.test.ts
│   │   ├── ohaeng.test.ts
│   │   └── daeun.test.ts
│   └── components/                   # 컴포넌트 렌더 테스트
│
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. 핵심 계산 로직 명세

### 3.1 데이터 타입 정의

```typescript
// src/store/types.ts

/** 천간 10개 */
export type CheonGan =
  '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';

/** 지지 12개 */
export type JiJi =
  '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

/** 오행 */
export type OHaeng = '木' | '火' | '土' | '金' | '水';

/** 음양 */
export type EumYang = '陰' | '陽';

/** 간지 쌍 */
export interface GanJi {
  gan: CheonGan;
  ji: JiJi;
}

/** 사주 4주 */
export interface SaJuPillar {
  year:  GanJi;  // 연주(年柱)
  month: GanJi;  // 월주(月柱)
  day:   GanJi;  // 일주(日柱)
  hour:  GanJi | null;  // 시주(時柱) — 시간 미입력 시 null
}

/** 십신 */
export type ShinShin =
  '비견' | '겁재' | '식신' | '상관' |
  '편재' | '정재' | '편관' | '정관' |
  '편인' | '정인';

/** 사용자 입력 */
export interface SajuInput {
  birthYear:   number;
  birthMonth:  number;
  birthDay:    number;
  birthHour:   number | null;  // 0–23, null = 시간 모름
  birthMinute: number | null;
  gender:      '남' | '여';
  isLunar:     boolean;
  isLeapMonth: boolean;
}

/** 오행 분포 결과 */
export interface OHaengDistribution {
  木: number;  // 비율 0–100
  火: number;
  土: number;
  金: number;
  水: number;
}

/** 용신 결과 */
export interface YongShin {
  yongShin:  OHaeng;  // 용신
  huiShin:   OHaeng;  // 희신
  giShin:    OHaeng;  // 기신
  guShin:    OHaeng;  // 구신
  hanShin:   OHaeng;  // 한신
  isGangShin: boolean; // 신강 여부
}

/** 대운 단일 항목 */
export interface DaeunItem {
  startAge:   number;   // 시작 나이
  endAge:     number;   // 종료 나이 (startAge + 9)
  pillar:     GanJi;    // 해당 대운 간지
}

/** 전체 분석 결과 */
export interface SajuResult {
  input:        SajuInput;
  pillars:      SaJuPillar;
  ohaeng:       OHaengDistribution;
  yongShin:     YongShin;
  daeunList:    DaeunItem[];
  daeunStartAge: number;          // 기대운수
  currentDaeun: DaeunItem | null;
  currentYear:  GanJi;            // 현재 태세
  currentMonth: GanJi;            // 현재 월건
}
```

### 3.2 천간·지지 속성 테이블

```typescript
// src/core/saju/ganji.ts

export const CHEONGAN_ATTR: Record<CheonGan, {
  ohaeng: OHaeng;
  eumyang: EumYang;
  korName: string;  // 한글 이름
}> = {
  '甲': { ohaeng: '木', eumyang: '陽', korName: '갑' },
  '乙': { ohaeng: '木', eumyang: '陰', korName: '을' },
  '丙': { ohaeng: '火', eumyang: '陽', korName: '병' },
  '丁': { ohaeng: '火', eumyang: '陰', korName: '정' },
  '戊': { ohaeng: '土', eumyang: '陽', korName: '무' },
  '己': { ohaeng: '土', eumyang: '陰', korName: '기' },
  '庚': { ohaeng: '金', eumyang: '陽', korName: '경' },
  '辛': { ohaeng: '金', eumyang: '陰', korName: '신' },
  '壬': { ohaeng: '水', eumyang: '陽', korName: '임' },
  '癸': { ohaeng: '水', eumyang: '陰', korName: '계' },
};

export const JIJI_ATTR: Record<JiJi, {
  ohaeng: OHaeng;
  eumyang: EumYang;
  season: string;
  korName: string;
}> = {
  '子': { ohaeng: '水', eumyang: '陽', season: '겨울', korName: '자' },
  '丑': { ohaeng: '土', eumyang: '陰', season: '겨울', korName: '축' },
  '寅': { ohaeng: '木', eumyang: '陽', season: '봄',   korName: '인' },
  '卯': { ohaeng: '木', eumyang: '陰', season: '봄',   korName: '묘' },
  '辰': { ohaeng: '土', eumyang: '陽', season: '봄',   korName: '진' },
  '巳': { ohaeng: '火', eumyang: '陰', season: '여름', korName: '사' },
  '午': { ohaeng: '火', eumyang: '陽', season: '여름', korName: '오' },
  '未': { ohaeng: '土', eumyang: '陰', season: '여름', korName: '미' },
  '申': { ohaeng: '金', eumyang: '陽', season: '가을', korName: '신' },
  '酉': { ohaeng: '金', eumyang: '陰', season: '가을', korName: '유' },
  '戌': { ohaeng: '土', eumyang: '陽', season: '가을', korName: '술' },
  '亥': { ohaeng: '水', eumyang: '陰', season: '겨울', korName: '해' },
};
```

### 3.3 연주(年柱) 산출 알고리즘

```typescript
// src/core/saju/pillar.ts

/**
 * 연주 천간 산출
 * 기준: 갑자년(甲子年) = 1984년
 * 천간 순서: 甲乙丙丁戊己庚辛壬癸 (index 0–9)
 */
export function getYearGan(solarYear: number): CheonGan {
  const CHEONGAN_ORDER: CheonGan[] =
    ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const idx = ((solarYear - 1984) % 10 + 10) % 10;
  return CHEONGAN_ORDER[idx];
}

/**
 * 연주 지지 산출
 * 기준: 갑자년(甲子年) = 1984년
 * 지지 순서: 子丑寅卯辰巳午未申酉戌亥 (index 0–11)
 */
export function getYearJi(solarYear: number): JiJi {
  const JIJI_ORDER: JiJi[] =
    ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const idx = ((solarYear - 1984) % 12 + 12) % 12;
  return JIJI_ORDER[idx];
}

/**
 * 월주(月柱) 산출
 * 월지는 절기 기준 고정:
 *   1월(인월寅月)–12월(축월丑月)
 * 월간은 연간(年干)에 따른 오호둔월법(五虎遁月法) 적용
 *
 * 오호둔월법 조견표:
 *   甲己년 → 寅월 시작 천간: 丙
 *   乙庚년 → 寅월 시작 천간: 戊
 *   丙辛년 → 寅월 시작 천간: 庚
 *   丁壬년 → 寅월 시작 천간: 壬
 *   戊癸년 → 寅월 시작 천간: 甲
 */
export function getMonthGan(yearGan: CheonGan, monthIndex: number): CheonGan {
  // monthIndex: 0 = 寅月(1월), 1 = 卯月(2월), ..., 11 = 丑月(12월)
  const BASE_TABLE: Record<string, number> = {
    '甲': 2, '己': 2,  // 丙 = index 2
    '乙': 4, '庚': 4,  // 戊 = index 4
    '丙': 6, '辛': 6,  // 庚 = index 6
    '丁': 8, '壬': 8,  // 壬 = index 8
    '戊': 0, '癸': 0,  // 甲 = index 0
  };
  const CHEONGAN_ORDER: CheonGan[] =
    ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const base = BASE_TABLE[yearGan];
  const idx = (base + monthIndex) % 10;
  return CHEONGAN_ORDER[idx];
}

/**
 * 일주(日柱) 산출
 * 갑자일(甲子日) 기준점: 양력 1900-01-01 = 甲戌日 (index: 10)
 * Julian Day Number 차이로 60갑자 순환 계산
 */
export function getDayGanJi(
  year: number, month: number, day: number
): GanJi {
  const CHEONGAN_ORDER: CheonGan[] =
    ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const JIJI_ORDER: JiJi[] =
    ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

  // 기준일: 1900-01-01 = 甲戌 (천간 index 0, 지지 index 10)
  const BASE_DATE = new Date(1900, 0, 1);
  const TARGET = new Date(year, month - 1, day);
  const diffDays = Math.floor(
    (TARGET.getTime() - BASE_DATE.getTime()) / 86400000
  );

  const ganIdx  = ((diffDays + 0) % 10 + 10) % 10;   // 甲 = 0 기준
  const jiIdx   = ((diffDays + 10) % 12 + 12) % 12;  // 子 = 0, 戌 = 10 기준

  return { gan: CHEONGAN_ORDER[ganIdx], ji: JIJI_ORDER[jiIdx] };
}

/**
 * 시주(時柱) 산출
 * 시지는 시각 기준 고정 (자시 23:30–01:29, 축시 01:30–03:29, ...)
 * 시간은 오자둔시법(五子遁時法) 적용
 *
 * 시지 경계 (표준시 기준):
 *   子시: 23:30 – 01:29
 *   丑시: 01:30 – 03:29
 *   ...
 *   亥시: 21:30 – 23:29
 *
 * 야자시(夜子時) 옵션: 23:30 이후를 다음날 子시로 처리 가능
 */
export function getHourJi(hour: number, minute: number): JiJi {
  const totalMin = hour * 60 + minute;
  // 각 시의 시작 분 (자시 시작을 23:30 = 1410으로 처리)
  const HOUR_BOUNDARIES = [
    { ji: '子' as JiJi, start: 1410 },  // 23:30
    { ji: '丑' as JiJi, start: 90  },   // 01:30
    { ji: '寅' as JiJi, start: 210 },
    { ji: '卯' as JiJi, start: 330 },
    { ji: '辰' as JiJi, start: 450 },
    { ji: '巳' as JiJi, start: 570 },
    { ji: '午' as JiJi, start: 690 },
    { ji: '未' as JiJi, start: 810 },
    { ji: '申' as JiJi, start: 930 },
    { ji: '酉' as JiJi, start: 1050 },
    { ji: '戌' as JiJi, start: 1170 },
    { ji: '亥' as JiJi, start: 1290 },
  ];
  const adjusted = totalMin < 90 ? totalMin + 1440 : totalMin;
  for (let i = HOUR_BOUNDARIES.length - 1; i >= 0; i--) {
    if (adjusted >= HOUR_BOUNDARIES[i].start) return HOUR_BOUNDARIES[i].ji;
  }
  return '亥';
}
```

### 3.4 합·충·형·파·해 감지 알고리즘

```typescript
// src/core/saju/relations.ts

/** 천간 합 (天干合 — 5합) */
export const CHEONGAN_HAP: [CheonGan, CheonGan, OHaeng][] = [
  ['甲', '己', '土'],
  ['乙', '庚', '金'],
  ['丙', '辛', '水'],
  ['丁', '壬', '木'],
  ['戊', '癸', '火'],
];

/** 지지 삼합 (地支三合) */
export const JIJI_SAMHAP: [JiJi, JiJi, JiJi, OHaeng][] = [
  ['寅', '午', '戌', '火'],
  ['亥', '卯', '未', '木'],
  ['申', '子', '辰', '水'],
  ['巳', '酉', '丑', '金'],
];

/** 지지 육합 (地支六合) */
export const JIJI_YUKHAP: [JiJi, JiJi, OHaeng][] = [
  ['子', '丑', '土'],
  ['寅', '亥', '木'],
  ['卯', '戌', '火'],
  ['辰', '酉', '金'],
  ['巳', '申', '水'],
  ['午', '未', '土'],
];

/** 지지 충 (地支沖 — 6충) */
export const JIJI_CHUNG: [JiJi, JiJi][] = [
  ['子', '午'], ['丑', '未'], ['寅', '申'],
  ['卯', '酉'], ['辰', '戌'], ['巳', '亥'],
];

/**
 * 사주 원국 내 관계 전체 감지
 * @returns 감지된 관계 목록 (UI 표시용)
 */
export interface RelationResult {
  type: '천간합' | '삼합' | '육합' | '충' | '방합';
  elements: (CheonGan | JiJi)[];
  resultOhaeng?: OHaeng;
  description: string;  // 한글 설명
}

export function detectRelations(pillars: SaJuPillar): RelationResult[] {
  const results: RelationResult[] = [];
  const gans  = [pillars.year.gan, pillars.month.gan, pillars.day.gan,
                 ...(pillars.hour ? [pillars.hour.gan] : [])];
  const jis   = [pillars.year.ji,  pillars.month.ji,  pillars.day.ji,
                 ...(pillars.hour ? [pillars.hour.ji]  : [])];

  // 천간합 감지
  for (const [g1, g2, ohaeng] of CHEONGAN_HAP) {
    if (gans.includes(g1) && gans.includes(g2)) {
      results.push({
        type: '천간합',
        elements: [g1, g2],
        resultOhaeng: ohaeng,
        description: `${g1}${g2} 천간합 → ${ohaeng} 화(化)`,
      });
    }
  }

  // 지지 충 감지
  for (const [j1, j2] of JIJI_CHUNG) {
    if (jis.includes(j1) && jis.includes(j2)) {
      results.push({
        type: '충',
        elements: [j1, j2],
        description: `${j1}${j2} 충(沖)`,
      });
    }
  }

  // 삼합·육합 감지 (동일 패턴으로 추가)
  // ... (이하 동일 패턴)

  return results;
}
```

### 3.5 대운 수(起大運數) 계산 알고리즘

```typescript
// src/core/daeun/daeunStart.ts

/**
 * 대운 수 계산
 *
 * 원칙:
 *   - 양남(陽男) / 음녀(陰女): 생일 이후 가장 가까운 절기까지 순행(順行)
 *   - 음남(陰男) / 양녀(陽女): 생일 이전 가장 가까운 절기까지 역행(逆行)
 *   - 날수 / 3 = 대운 수 (소수점 올림, 단 나머지 1 = 버림, 나머지 2 = 올림)
 *
 * @param birthDate  생년월일 (Date 객체)
 * @param yearGan    연간(年干)
 * @param gender     '남' | '여'
 * @returns 기대운수 (정수, 단위: 세)
 */
export function calcDaeunStartAge(
  birthDate: Date,
  yearGan: CheonGan,
  gender: '남' | '여'
): { startAge: number; isForward: boolean; daysDiff: number } {
  const ganYinYang = CHEONGAN_ATTR[yearGan].eumyang;
  const isForward =
    (gender === '남' && ganYinYang === '陽') ||
    (gender === '여' && ganYinYang === '陰');

  const nearestJulgi = isForward
    ? getNextJulgiDate(birthDate)   // 이후 절기
    : getPrevJulgiDate(birthDate);  // 이전 절기

  const daysDiff = Math.abs(
    Math.floor((nearestJulgi.getTime() - birthDate.getTime()) / 86400000)
  );

  // 날수 → 대운 수 변환 (3일 = 1세)
  const remainder = daysDiff % 3;
  const startAge = remainder === 0
    ? daysDiff / 3
    : remainder === 1
      ? Math.floor(daysDiff / 3)      // 나머지 1 → 버림
      : Math.ceil(daysDiff / 3);      // 나머지 2 → 올림

  return { startAge, isForward, daysDiff };
}
```

### 3.6 십신(十神) 계산 알고리즘

```typescript
// src/core/saju/sinshin.ts

/**
 * 십신 계산 — 일간(日干) 기준
 *
 * 오행 상생상극 관계:
 *   생(生): 木→火→土→金→水→木
 *   극(克): 木→土→水→火→金→木
 *
 * 십신 분류:
 *   같은 오행 + 같은 음양 → 비견(比肩)
 *   같은 오행 + 다른 음양 → 겁재(劫財)
 *   일간이 생하는 오행 + 다른 음양 → 식신(食神)
 *   일간이 생하는 오행 + 같은 음양 → 상관(傷官)
 *   일간이 극하는 오행 + 다른 음양 → 편재(偏財)
 *   일간이 극하는 오행 + 같은 음양 → 정재(正財)
 *   일간을 극하는 오행 + 같은 음양 → 편관(偏官) — 칠살(七殺)
 *   일간을 극하는 오행 + 다른 음양 → 정관(正官)
 *   일간을 생하는 오행 + 같은 음양 → 편인(偏印)
 *   일간을 생하는 오행 + 다른 음양 → 정인(正印)
 */
export function getShinShin(
  dayGan: CheonGan,
  targetGan: CheonGan
): ShinShin {
  const dayAttr    = CHEONGAN_ATTR[dayGan];
  const targetAttr = CHEONGAN_ATTR[targetGan];
  const sameEumYang = dayAttr.eumyang === targetAttr.eumyang;

  if (dayAttr.ohaeng === targetAttr.ohaeng) {
    return sameEumYang ? '비견' : '겁재';
  }
  if (isGenerating(dayAttr.ohaeng, targetAttr.ohaeng)) {
    return sameEumYang ? '상관' : '식신';
  }
  if (isOvercoming(dayAttr.ohaeng, targetAttr.ohaeng)) {
    return sameEumYang ? '편재' : '정재';
  }
  if (isOvercoming(targetAttr.ohaeng, dayAttr.ohaeng)) {
    return sameEumYang ? '편관' : '정관';
  }
  // 일간을 생하는 오행
  return sameEumYang ? '편인' : '정인';
}

/** 오행 상생 관계 확인 (A가 B를 생함) */
function isGenerating(a: OHaeng, b: OHaeng): boolean {
  const GEN: Record<OHaeng, OHaeng> = {
    '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
  };
  return GEN[a] === b;
}

/** 오행 상극 관계 확인 (A가 B를 극함) */
function isOvercoming(a: OHaeng, b: OHaeng): boolean {
  const OVR: Record<OHaeng, OHaeng> = {
    '木': '土', '土': '水', '水': '火', '火': '金', '金': '木'
  };
  return OVR[a] === b;
}
```

---

## 4. 상태 관리 (Zustand Store)

```typescript
// src/store/sajuStore.ts

import { create } from 'zustand';

interface SajuStore {
  // 입력 상태
  input: SajuInput | null;
  setInput: (input: SajuInput) => void;

  // 결과 상태
  result: SajuResult | null;
  isCalculating: boolean;
  error: string | null;

  // 액션
  calculate: () => Promise<void>;
  reset: () => void;

  // UI 상태
  activeSection: string;   // 현재 스크롤 섹션 ID
  setActiveSection: (id: string) => void;

  selectedDaeunAge: number | null;  // 클릭된 대운 나이
  setSelectedDaeunAge: (age: number | null) => void;

  selectedSeunYear: number;         // 조회 중인 세운 연도
  setSelectedSeunYear: (year: number) => void;
}

export const useSajuStore = create<SajuStore>((set, get) => ({
  input: null,
  result: null,
  isCalculating: false,
  error: null,
  activeSection: 'myeongban',
  selectedDaeunAge: null,
  selectedSeunYear: new Date().getFullYear(),

  setInput: (input) => set({ input }),

  calculate: async () => {
    const { input } = get();
    if (!input) return;
    set({ isCalculating: true, error: null });
    try {
      const result = await computeSajuResult(input);  // core/ 호출
      // 일간 오행으로 CSS 변수 동적 주입
      const dayGanOhaeng = CHEONGAN_ATTR[result.pillars.day.gan].ohaeng;
      injectOhaengTheme(dayGanOhaeng);
      set({ result, isCalculating: false });
    } catch (e) {
      set({ error: '계산 중 오류가 발생했습니다.', isCalculating: false });
    }
  },

  reset: () => set({ input: null, result: null, error: null }),
  setActiveSection: (id) => set({ activeSection: id }),
  setSelectedDaeunAge: (age) => set({ selectedDaeunAge: age }),
  setSelectedSeunYear: (year) => set({ selectedSeunYear: year }),
}));

/** 일간 오행 기준 CSS 변수 동적 주입 */
function injectOhaengTheme(ohaeng: OHaeng) {
  const OHAENG_CSS: Record<OHaeng, { primary: string; onDark: string }> = {
    '木': { primary: '#2d6a4f', onDark: '#52b788' },
    '火': { primary: '#b83c10', onDark: '#e07a5f' },
    '土': { primary: '#8b6914', onDark: '#d4a853' },
    '金': { primary: '#4a5568', onDark: '#a0aec0' },
    '水': { primary: '#1a3a5c', onDark: '#4a90d9' },
  };
  const root = document.documentElement;
  root.style.setProperty('--color-primary',        OHAENG_CSS[ohaeng].primary);
  root.style.setProperty('--color-primary-on-dark', OHAENG_CSS[ohaeng].onDark);
}
```

---

## 5. CSS 변수 토큰 전체 정의

```css
/* src/styles/globals.css */

:root {
  /* ─── 서피스 ─── */
  --canvas-white:       #ffffff;
  --canvas-parchment:   #f5f4f0;
  --canvas-pearl:       #faf9f6;
  --tile-dark-1:        #1c1c1e;
  --tile-dark-2:        #1e1e20;
  --tile-dark-3:        #191919;
  --void-black:         #000000;

  /* ─── 오행 팔레트 ─── */
  --wood-primary:       #2d6a4f;
  --wood-on-dark:       #52b788;
  --fire-primary:       #b83c10;
  --fire-on-dark:       #e07a5f;
  --earth-primary:      #8b6914;
  --earth-on-dark:      #d4a853;
  --metal-primary:      #4a5568;
  --metal-on-dark:      #a0aec0;
  --water-primary:      #1a3a5c;
  --water-on-dark:      #4a90d9;

  /* ─── 런타임 강조색 (JS 주입) ─── */
  --color-primary:          var(--water-primary);
  --color-primary-on-dark:  var(--water-on-dark);
  --color-focus:            #2a6fcd;

  /* ─── 텍스트 ─── */
  --ink:            #1a1a1c;
  --ink-muted-80:   #3a3a3c;
  --ink-muted-48:   #808080;
  --on-dark:        #ffffff;
  --on-dark-muted:  #c8c8cc;

  /* ─── 선·테두리 ─── */
  --divider-soft:   #f0efeb;
  --hairline:       #e2e1dc;
  --chip-glass:     rgba(210, 210, 215, 0.64);

  /* ─── 타이포그래피 ─── */
  --font-primary:   'WenKaiKR', 'Noto Serif KR', serif;

  /* ─── 간격 ─── */
  --sp-xxs:     4px;
  --sp-xs:      8px;
  --sp-sm:      12px;
  --sp-md:      16px;
  --sp-lg:      24px;
  --sp-xl:      32px;
  --sp-xxl:     48px;
  --sp-section: 80px;
  --sp-hero:    120px;

  /* ─── 모서리 반경 ─── */
  --r-none:  0px;
  --r-sm:    8px;
  --r-md:    12px;
  --r-lg:    18px;
  --r-pill:  9999px;
  --r-full:  50%;

  /* ─── 명반 그림자 (시스템 유일) ─── */
  --shadow-myeongban: rgba(0, 0, 0, 0.10) 0px 4px 32px 0px;
}
```

---

## 6. 컴포넌트 인터페이스 명세

### 6.1 SajuCard (命盤 카드)

```typescript
interface SajuCardProps {
  pillars:   SaJuPillar;
  ohaeng:    OHaengDistribution;
  relations: RelationResult[];
  isDark?:   boolean;  // 다크 타일 위 여부
}
```

### 6.2 OhaengChart (오행 분포 차트)

```typescript
interface OhaengChartProps {
  distribution: OHaengDistribution;
  yongShin:     YongShin;
  dayGanOhaeng: OHaeng;  // 활성 강조 오행
}
// 렌더: 5개 가로 막대 — 활성 오행은 --color-primary, 나머지는 --hairline
// 각 막대 우측에 한자 아이콘 + 수치(%) 한글 병기
```

### 6.3 DaeunTimeline (대운 타임라인)

```typescript
interface DaeunTimelineProps {
  daeunList:    DaeunItem[];
  startAge:     number;
  currentAge:   number;
  onSelect:     (age: number) => void;
  selectedAge:  number | null;
}
// 렌더: 수평 스크롤 타임라인
// 현재 대운 강조 (--color-primary border)
// 클릭 → 상세 패널 열림
```

### 6.4 HanjaGlyph (한자 장식 래퍼)

```typescript
interface HanjaGlyphProps {
  char:      string;        // 한자 문자
  size?:     'hero' | 'tile' | 'icon';  // 크기 프리셋
  opacity?:  number;        // 워터마크용 (기본 1.0)
  className?: string;
}
// aria-hidden="true" 자동 적용
// role="presentation" 추가
// 폰트: WenKaiKR weight 300 고정
```

---

## 7. 공유 URL 인코딩 명세

```typescript
// src/utils/share.ts

/**
 * 사주 입력 → URL 쿼리 파라미터 인코딩
 * 서버 저장 없음 — 모든 데이터는 URL에만 존재
 *
 * 파라미터:
 *   by = 생년 (4자리)
 *   bm = 생월 (2자리)
 *   bd = 생일 (2자리)
 *   bh = 생시 (2자리, 없으면 생략)
 *   g  = 성별 (m/f)
 *   l  = 음력여부 (0/1)
 *   lp = 윤달여부 (0/1, l=1일 때만)
 *
 * 예시: /result?by=1990&bm=03&bd=15&bh=14&g=m&l=0
 */
export function encodeShareUrl(input: SajuInput): string {
  const params = new URLSearchParams({
    by: String(input.birthYear),
    bm: String(input.birthMonth).padStart(2, '0'),
    bd: String(input.birthDay).padStart(2, '0'),
    g:  input.gender === '남' ? 'm' : 'f',
    l:  input.isLunar ? '1' : '0',
  });
  if (input.birthHour !== null) {
    params.set('bh', String(input.birthHour).padStart(2, '0'));
  }
  if (input.isLunar && input.isLeapMonth) {
    params.set('lp', '1');
  }
  return `/result?${params.toString()}`;
}

export function decodeShareUrl(search: string): SajuInput | null {
  // 역방향 파싱 — 유효성 검증 포함
  // 유효하지 않은 파라미터 시 null 반환
}
```

---

## 8. 테스트 명세

### 8.1 필수 단위 테스트 케이스

```typescript
// tests/core/pillar.test.ts — 검증 케이스 예시

describe('연주 산출', () => {
  it('1984년 = 甲子', () => {
    expect(getYearGan(1984)).toBe('甲');
    expect(getYearJi(1984)).toBe('子');
  });
  it('2024년 = 甲辰', () => {
    expect(getYearGan(2024)).toBe('甲');
    expect(getYearJi(2024)).toBe('辰');
  });
  it('1900년 = 庚子', () => {
    expect(getYearGan(1900)).toBe('庚');
    expect(getYearJi(1900)).toBe('子');
  });
});

describe('절입 경계 처리', () => {
  it('입춘(立春) 이전 출생 → 전년도 연주 적용', () => {
    // 2024년 2월 3일 (입춘 전) 출생 → 연주는 2023년 癸卯
    const result = computeYearPillar(new Date(2024, 1, 3), JULGI_2024_IPCHUN);
    expect(result.gan).toBe('癸');
    expect(result.ji).toBe('卯');
  });
});

describe('대운 수 계산', () => {
  it('양남 — 생일 이후 절기까지 날수/3', () => {
    // 검증 케이스: 실제 명리 교재 예제 사용
  });
  it('나머지 1 → 버림', () => { /* ... */ });
  it('나머지 2 → 올림', () => { /* ... */ });
});
```

### 8.2 테스트 커버리지 목표

| 모듈 | 목표 커버리지 |
|------|------------|
| `core/saju/pillar.ts` | 95% 이상 |
| `core/saju/relations.ts` | 90% 이상 |
| `core/saju/sinshin.ts` | 90% 이상 |
| `core/daeun/daeunStart.ts` | 95% 이상 |
| `core/calendar/solarLunar.ts` | 90% 이상 |

---

## 9. 성능 최적화 명세

### 9.1 폰트 최적화

```html
<!-- public/layout.tsx head 섹션 -->
<link rel="preload" href="/fonts/LXGWWenKaiKR-Regular.ttf"
      as="font" type="font/truetype" crossOrigin="anonymous" />
<!-- Light, Medium은 지연 로딩 -->
```

- Regular 폰트를 크리티컬 경로에 preload.
- Light(장식용)·Medium은 `font-display: swap`으로 비동기 로딩.
- 폰트 파일 서브셋 고려: 한자 장식에 쓰이는 글리프(천간 10 + 지지 12 + 五行 5 + 장식 수십 자)를 별도 서브셋 파일로 추출하여 Light 폰트 초기 로딩 부담 감소.

### 9.2 계산 최적화

- 만세력 절기 데이터: 빌드 타임에 JSON으로 번들링. 런타임 파싱 없음.
- 사주 계산 결과: `useMemo`로 메모이제이션. 동일 입력 재계산 방지.
- 대운 목록(100개 이상): 초기 렌더링은 현재 대운 ±5개만, 나머지는 가상 스크롤.

### 9.3 이미지 없음 정책

- 배경 이미지(수묵화 등)는 v1.0 범위 외. 순수 CSS 타일 배경만 사용.
- 오행 아이콘은 한자 텍스트(木火土金水) 렌더링. SVG/PNG 이미지 불필요.

---

## 10. 배포 및 환경 설정

```typescript
// next.config.ts
const nextConfig = {
  output: 'export',        // 정적 HTML 내보내기 (서버 불필요)
  trailingSlash: true,     // Vercel/GitHub Pages 호환
  images: { unoptimized: true },  // 이미지 최적화 비활성 (이미지 없음)
};
```

### 환경 변수 (불필요 항목)
- 외부 API 키 없음.
- 데이터베이스 연결 없음.
- 모든 계산이 클라이언트 사이드에서 완결.

### 배포 체크리스트
- [ ] Vitest 전체 테스트 통과 확인
- [ ] Lighthouse 성능 점수 90 이상 (모바일)
- [ ] WCAG 2.1 AA 접근성 감사 통과
- [ ] 1900–2100년 범위 절기 데이터 정합성 검증
- [ ] 주요 사주 샘플 (100개 이상) 계산 결과 교차 검증
- [ ] 공유 URL 인코딩/디코딩 왕복 테스트
- [ ] 모바일(iOS Safari, Android Chrome) 폰트 렌더링 확인
