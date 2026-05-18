# 命理 사주 프로그램 — 전문 디자인 시스템 프롬프트

> **대상 폰트:** LXGWWenKaiKR-Light.ttf / LXGWWenKaiKR-Regular.ttf / LXGWWenKaiKR-Medium.ttf  
> **디자인 레퍼런스:** Apple Inc. 브랜드 시스템 (전면 재해석 적용)  
> **목적:** 전통 동양 사상과 현대 미니멀리즘이 교차하는 최고급 사주 명리 웹 인터페이스 설계

---

## 一. 디자인 철학 (設計哲學)

### 핵심 명제
> *"하늘의 이치를 담되, 군더더기 없이."*

Apple 디자인의 본질 — **제품(콘텐츠)이 말하게 하고 UI는 사라지게 하라** — 을 사주 명리 맥락으로 번역한다.  
사주 명리의 핵심인 **천간(天干)·지지(地支)·오행(五行)·사주팔자(四柱八字)** 가 UI 크롬 없이 전면에 드러나야 한다.  
UI는 존재하되 보이지 않는다. 사용자의 시선은 오직 命盤과 해석 텍스트에만 머문다.

### 세 가지 핵심 원칙

| 원칙 | Apple 원문 개념 | 사주 프로그램 적용 |
|------|---------------|-----------------|
| **콘텐츠 집중** | Photography-first; UI recedes so the product can speak | 命盤·사주팔자표가 유일한 주인공. UI 요소는 시선 경쟁 금지 |
| **단일 강조** | Single blue accent carries every interactive element | 오행(五行) 중 사용자 일간(日干)의 오행 1색이 유일한 강조색 |
| **공간이 받침대** | Whitespace is the product's pedestal | 넓은 여백이 命盤을 들어올린다. 빽빽함은 전통 달력이지 현대 앱이 아니다 |

### 한자 사용 원칙 (디자인 전용)

한자는 **디자인 장치** 로만 사용한다. 기능 설명·버튼 레이블·안내 문구는 **모두 한글** 로 작성한다.

**한자 허용 위치:**
- 섹션 대제목 앞 장식 한자 (예: `命理`, `五行`, `大運`, `八字`)
- 타일 배경 워터마크 한자 (opacity 4–6%)
- 오행 아이콘 레이블 (木 火 土 金 水)
- 천간·지지 표기 (甲乙丙丁…, 子丑寅卯…)
- 내비게이션 브랜드 로고타입

**한자 금지 위치:**
- 버튼 레이블 (예: "저장하기" — '保存' 금지)
- 입력 필드 플레이스홀더
- 오류 메시지·알림
- 결과 해석 본문
- 도움말·가이드 텍스트

---

## 二. 색상 시스템 (色相 시스템)

### 기본 캔버스

Apple의 White ↔ Parchment ↔ Near-Black 3단 서피스 체계를 동양 지류(紙類) 감성으로 재해석한다.

```css
/* ─── 기본 서피스 ─── */
--canvas-white:       #ffffff;   /* 주 배경 — 命盤 카드, 결과 영역 */
--canvas-parchment:   #f5f4f0;   /* 선지(宣紙)색 — 섹션 전환, 푸터 */
                                  /* Apple #f5f5f7을 황토기 미량 가미해 재해석 */
--canvas-pearl:       #faf9f6;   /* 보조 버튼 배경용 미백색 */

/* ─── 다크 타일 (야간 모드·프리미엄 해석 섹션) ─── */
--tile-dark-1:        #1c1c1e;   /* 주 다크 타일 — 五行 종합 해석, 大運 타임라인 */
--tile-dark-2:        #1e1e20;   /* 보조 다크 타일 — 인접 다크 타일 미묘한 분리 */
--tile-dark-3:        #191919;   /* 최하단·영상 플레이어 배경 */
--void-black:         #000000;   /* 글로벌 내비 바 배경 — 유일한 순수 블랙 */
```

### 五行 강조 색상 — 단 하나의 활성 강조

Apple이 모든 인터랙티브 요소에 단 하나의 Action Blue만 쓰듯,  
이 앱은 **사용자 일간(日干)의 오행 1색** 만을 강조색으로 사용한다.  
나머지 오행 색은 비활성 상태로 잠들어 있다가 해당 섹션 호버 시에만 미약하게 깨어난다.

```css
/* ─── 五行 팔레트 ─── */
--wood-primary:       #2d6a4f;   /* 木 — 심록(深綠), 생장과 뻗음 */
--wood-on-dark:       #52b788;   /* 木 — 다크 타일 위 링크·강조 */

--fire-primary:       #b83c10;   /* 火 — 주홍(朱紅), 열기와 밝음 */
--fire-on-dark:       #e07a5f;   /* 火 — 다크 타일 위 링크·강조 */

--earth-primary:      #8b6914;   /* 土 — 황토(黃土), 중심과 안정 */
--earth-on-dark:      #d4a853;   /* 土 — 다크 타일 위 링크·강조 */

--metal-primary:      #4a5568;   /* 金 — 철회(鐵灰), 강결과 수렴 */
--metal-on-dark:      #a0aec0;   /* 金 — 다크 타일 위 링크·강조 */

--water-primary:      #1a3a5c;   /* 水 — 심청(深靑), 깊음과 지혜 */
--water-on-dark:      #4a90d9;   /* 水 — 다크 타일 위 링크·강조 */

/* ─── 런타임 강조색 — JS가 일간 계산 후 주입 ─── */
--color-primary:          var(--water-primary);      /* 기본값: 水 */
--color-primary-on-dark:  var(--water-on-dark);
--color-focus:            /* primary 명도 +12% — 포커스 링 전용 */;
```

### 텍스트 색상

```css
--ink:            #1a1a1c;   /* 먹빛 — 모든 헤드라인·본문 (라이트 캔버스) */
--ink-muted-80:   #3a3a3c;   /* 보조 텍스트 */
--ink-muted-48:   #808080;   /* 비활성·법적 고지 */
--on-dark:        #ffffff;   /* 다크 타일 위 텍스트 */
--on-dark-muted:  #c8c8cc;   /* 다크 타일 보조 카피 */
```

### 선 & 테두리

```css
--divider-soft:   #f0efeb;                /* 카드 테두리 — rgba(0,0,0,0.04) 병용 */
--hairline:       #e2e1dc;                /* 유틸리티 카드 1px 선 */
--chip-glass:     rgba(210,210,215,0.64); /* 이미지 위 원형 컨트롤 */
```

> **절대 금지:** 장식용 CSS 그라디언트 없음. 수묵화·산수화 배경은 사진 에셋으로만 처리. 그라디언트 토큰 정의 없음.

---

## 三. 타이포그래피 시스템 (書體 시스템)

### 폰트 패밀리 선언

```css
@font-face {
  font-family: 'WenKaiKR';
  src: url('LXGWWenKaiKR-Light.ttf') format('truetype');
  font-weight: 300;
  font-display: swap;
}
@font-face {
  font-family: 'WenKaiKR';
  src: url('LXGWWenKaiKR-Regular.ttf') format('truetype');
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: 'WenKaiKR';
  src: url('LXGWWenKaiKR-Medium.ttf') format('truetype');
  font-weight: 500;
  font-display: swap;
}

/* 한글·한자·영문 모두 WenKaiKR 단일 서체로 통일                          */
/* 커버리지: 한글 11,172자 완전 / 한자 11,100자 / 기본 라틴 95자 전체      */
--font-primary: 'WenKaiKR', 'Noto Serif KR', serif;
```

**선택 근거:** LXGWWenKaiKR은 붓글씨(筆書) 계열 손글씨 서체로, 사주 명리의 전통성과 현대적 명료함을 동시에 담는다. Apple이 SF Pro의 '부드러운 정밀함'을 브랜드 목소리로 삼듯, 이 프로그램은 WenKaiKR의 **'획의 온기'** 를 브랜드 목소리로 삼는다. 한자(천간·지지·오행 문자)가 같은 폰트 파일 안에 포함되어 있어 폰트 혼용 없이 완벽한 시각 통일을 달성한다.

### 위계 토큰 (Typography Scale)

| 토큰 | 크기 | 굵기 | 행간 | 자간 | 용도 |
|------|------|------|------|------|------|
| `--typo-hero` | 52px | 500 | 1.08 | -0.30px | 히어로 헤드라인 `命理를 밝히다` |
| `--typo-display-lg` | 38px | 500 | 1.10 | -0.20px | 타일 대제목 `五行 분석` `大運 흐름` |
| `--typo-display-md` | 30px | 500 | 1.45 | -0.30px | 섹션 헤드 |
| `--typo-lead` | 24px | 400 | 1.15 | +0.10px | 타일 부제, 命盤 카드 소제목 |
| `--typo-lead-airy` | 20px | 300 | 1.58 | 0 | 해설 리드 단락 — Light 굵기 전용 |
| `--typo-tagline` | 18px | 500 | 1.20 | +0.20px | 서브 타이틀, 서브 내비 카테고리 |
| `--typo-body-strong` | 16px | 500 | 1.30 | -0.20px | 강조 본문, 인라인 키워드 |
| `--typo-body` | 16px | 400 | 1.50 | -0.20px | 기본 본문 — 해석 텍스트 전체 |
| `--typo-caption` | 13px | 400 | 1.45 | -0.15px | 보조 캡션, 버튼 레이블 |
| `--typo-caption-strong` | 13px | 500 | 1.30 | -0.15px | 강조 캡션 |
| `--typo-fine` | 11px | 400 | 1.30 | -0.08px | 법적 고지, 푸터 본문 |
| `--typo-nav` | 12px | 400 | 1.00 | -0.12px | 글로벌 내비 메뉴 항목 |
| `--typo-glyph-hero` | 64px | 300 | 1.00 | 0 | 天干·地支 단독 표기 (命盤 내 한자) |
| `--typo-glyph-tile` | 120px | 300 | 1.00 | 0 | 타일 배경 워터마크 한자 (opacity 4–6%) |

### 타이포그래피 원칙

1. **자간 압축 규칙:** 16px 이상 모든 헤드라인에 음수 자간(-0.15 ~ -0.30px) 적용. Apple의 'tight headline' 감각을 WenKaiKR의 획 특성에 맞게 재현.
2. **굵기 사다리:** 300(Light) / 400(Regular) / 500(Medium). 중간값 없음. 400 미만은 장식·여백감용, 500은 강조용으로만 사용.
3. **본문은 16px.** Apple의 17px 원칙을 한글 가독성 기준으로 16px로 조정(WenKaiKR의 한글 글리프는 x-height가 충분히 높음).
4. **한자 장식 글리프** (`--typo-glyph-hero`, `--typo-glyph-tile`)는 weight 300(Light)만 사용. 무게감이 줄어 배경에 자연스럽게 흡수됨.
5. **행간은 콘텍스트별.** 헤드라인 1.08–1.20 / 본문 1.50 / 리드 1.58 / 푸터 링크 2.20.

---

## 四. 레이아웃 시스템 (配置 시스템)

### 간격 토큰 (Spacing Scale)

8px 기본 단위. 구조 레이아웃은 8의 배수로만 스냅.

```css
--sp-xxs:     4px;
--sp-xs:      8px;
--sp-sm:      12px;
--sp-md:      16px;
--sp-lg:      24px;
--sp-xl:      32px;
--sp-xxl:     48px;
--sp-section: 80px;   /* 타일 상하 패딩 — Apple 원본과 동일 */
--sp-hero:    120px;  /* 히어로 섹션 최소 상단 공기 */
```

### 그리드 & 컨테이너

- **최대 콘텐츠 폭:** 텍스트 섹션 960px / 命盤 그리드 섹션 1280px / 히어로 타일 전면 풀블리드
- **칼럼:** 命盤 카드 2칸 / 운세 유틸리티 카드 3–4칸 / 모바일 단일 칼럼
- **거터:** 카드 사이 20–24px

### 여백 철학

Apple의 원칙을 그대로 계승: **여백은 콘텐츠의 받침대다.**  
- 각 타일 헤드라인 위 최소 64px 공기
- 命盤 카드와 인접 요소 사이 최소 40px
- 설명 텍스트와 命盤 사이 절대 붙이지 않음

---

## 五. 컴포넌트 시스템 (構成 시스템)

### 글로벌 내비게이션

```
컴포넌트:   global-nav
배경:       --void-black (#000000)
높이:       44px
텍스트:     --on-dark / --typo-nav (12px / 400 / -0.12px)
브랜드 로고타입: "命理" (한자 장식) + "사주" (한글 기능명) — WenKaiKR Medium 18px
우측 클러스터: 설정 아이콘 / 공유 아이콘
모바일(≤768px): 로고 + 햄버거 메뉴만 노출
```

### 서브 내비게이션 (毛玻璃 효과)

```
컴포넌트:   sub-nav-frosted
배경:       --canvas-parchment 80% opacity
            + backdrop-filter: saturate(180%) blur(20px)
높이:       52px
좌측:       현재 섹션명 (한글) — --typo-tagline (18px / 500)
우측:       섹션 인라인 링크 + 활성 CTA 버튼 (--color-primary 배경 pill)
```

### 버튼 체계

**기본 액션 버튼 (pill형)**
```css
/* button-primary */
배경:          --color-primary
텍스트:        #ffffff / --typo-caption (13px / 400)
border-radius: 9999px  /* 완전 pill */
padding:       10px 20px
활성 상태:     transform: scale(0.96)   /* Apple 미세 인터랙션 동일 적용 */
포커스:        outline: 2px solid var(--color-focus); outline-offset: 2px
```

**보조 버튼 (ghost pill형)**
```css
/* button-secondary */
배경:          transparent
텍스트:        --color-primary / --typo-caption
테두리:        1px solid --color-primary
border-radius: 9999px
padding:       10px 20px
```

**유틸리티 버튼 (compact rect형)**
```css
/* button-utility */
배경:          --ink (#1a1a1c)
텍스트:        --on-dark / --typo-caption (13px / 400)
border-radius: 8px
padding:       7px 14px
활성 상태:     transform: scale(0.96)
```

**아이콘 원형 버튼 (이미지 위 부유)**
```css
/* button-icon-circular */
크기:          44×44px
배경:          --chip-glass  (rgba(210,210,215,0.64))
border-radius: 50%
용도:          캐러셀 컨트롤, 닫기 버튼
```

### 명반(命盤) 카드 — 핵심 컴포넌트

사주 프로그램의 '제품 사진'에 해당하는 핵심 UI. 절대 혼잡하게 만들지 않는다.

```
컴포넌트:   saju-card (사주팔자표)

라이트 모드:
  배경:          --canvas-white
  테두리:        1px solid --hairline
  border-radius: 18px
  패딩:          32px
  그림자:        rgba(0,0,0,0.10) 0px 4px 32px 0px
                 ← 이 그림자가 시스템 전체에서 유일한 elevation

다크 모드 (프리미엄 해석 섹션):
  배경:          --tile-dark-1
  텍스트:        --on-dark
  동일 radius·padding 유지

내부 구조:
  ┌────────────────────────────────────────────────┐
  │  八字  (배경 워터마크 한자, opacity: 5%)        │ ← --typo-glyph-tile / weight 300
  │                                                │
  │  연주(年柱)  월주(月柱)  일주(日柱)  시주(時柱)  │ ← 컬럼 레이블 (한글)
  │  甲          乙          丙          丁          │ ← 천간 한자 --typo-glyph-hero 64px
  │  子          丑          寅          卯          │ ← 지지 한자
  │                                                │
  │  오행 비율 바  (단색 수평 바)                   │ ← --color-primary 단색
  │  木 ██░░░  火 ░░░░  土 ██░░  金 ░░░  水 ████   │
  └────────────────────────────────────────────────┘

오행 비율 바 규칙:
  - 활성 오행(일간 기준): --color-primary 채움
  - 비활성 오행: --hairline 채움
  - 레이블: 한자 아이콘(木火土金水) + 수치(%) 한글 병기
```

### 타일 섹션 체계 (Apple tile rhythm 직접 계승)

Apple의 white ↔ parchment ↔ dark 교번 리듬을 그대로 채택한다.  
색 전환 자체가 구분선이며 별도의 hr·border 불필요.

```
tile-light:      배경 --canvas-white     / 텍스트 --ink
tile-parchment:  배경 --canvas-parchment / 텍스트 --ink
tile-dark:       배경 --tile-dark-1      / 텍스트 --on-dark

권장 페이지 흐름:
  [히어로 타일 — light]
  ↓ 색 전환 (구분선 대체)
  [사주 정보 입력 타일 — parchment]
  ↓
  [命盤 결과 타일 — light]
  ↓
  [五行 분석 타일 — dark ★]
  ↓
  [大運·歲運 타임라인 타일 — parchment]
  ↓
  [종합 해석 타일 — dark ★]
  ↓
  [푸터 — parchment]

★ 다크 타일은 프리미엄·심층 콘텐츠 섹션에만 배정.
  연속 다크 타일이 불가피할 경우 tile-dark-2 (#1e1e20)로 미묘한 분리.
```

### 운세 유틸리티 카드 (그리드형)

```
컴포넌트:   fortune-card
배경:       --canvas-white
테두리:     1px solid --hairline
border-radius: 18px
패딩:       24px
내부 구조:  한자 아이콘(木/火/土/金/水, 36px, weight 300)
            + 항목명 (한글, --typo-body-strong)
            + 수치·설명 (한글, --typo-body)
그림자:     없음 (그림자는 saju-card 전용)
hover:      border-color → --color-primary; transition: border-color 0.2s ease
```

### 사주 입력 폼

```
컴포넌트:   input-saju
배경:       --canvas-white
테두리:     1px solid rgba(0,0,0,0.10)
border-radius: 9999px  /* pill — 버튼 문법과 통일 */
padding:    12px 20px / height: 48px
폰트:       --typo-body / --ink
placeholder 색상: --ink-muted-48

플레이스홀더 예시 (모두 한글):
  생년월일을 입력하세요     ← '生年月日' 한자 플레이스홀더 금지
  태어난 시간을 선택하세요

포커스:     outline: 2px solid var(--color-focus); outline-offset: 2px
```

### 플로팅 결과 바 (스크롤 시 하단 고정)

```
컴포넌트:   floating-result-bar
배경:       --canvas-parchment 80% opacity + backdrop-filter: blur(20px)
높이:       64px / padding: 12px 32px
좌측:       일간(日干) 한자 + 오행 이름 (한글) — --typo-body
우측:       button-primary ("상세 해석 보기" — 한글)
```

### 푸터

```
배경:           --canvas-parchment
텍스트:         --ink-muted-80
링크 열 행간:   --typo-body (16px / 400 / 행간 2.20) — Apple dense-link 패턴 동일
열 헤드:        --typo-caption-strong (13px / 500) — 한글
법적 고지:      --typo-fine (11px / 400) / --ink-muted-48
상하 패딩:      64px
브랜드 서명:    "命理 사주" — WenKaiKR Medium (한자 장식 + 한글 병기)
```

---

## 六. 입면 & 깊이 (立面 시스템)

| 레벨 | 처리 방식 | 사용처 |
|------|-----------|--------|
| 완전 플랫 | 그림자 없음, 테두리 없음 | 전면 타일, 내비 바, 푸터 |
| 소프트 헤어라인 | 1px `rgba(0,0,0,0.08)` | 유틸리티 카드, 서브 내비 구분선 |
| 毛玻璃 (frosted glass) | `backdrop-filter: saturate(180%) blur(20px)` | 서브 내비, 플로팅 결과 바 |
| **命盤 그림자** | `rgba(0,0,0,0.10) 0px 4px 32px 0px` | **命盤 카드 전용 — 시스템 유일 그림자** |

**그림자 철학:** Apple이 제품 사진에만 단 하나의 그림자를 쓰듯, 이 앱은 命盤 카드에만 단 하나의 그림자를 쓴다. 버튼·텍스트·일반 운세 카드에는 그림자 절대 금지.

---

## 七. 형태 & 모서리 (形態 시스템)

### 모서리 반경 토큰

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--r-none` | 0px | 전면 타일 — 모서리 없음, edge-to-edge |
| `--r-sm` | 8px | 유틸리티 버튼, 내부 이미지 |
| `--r-md` | 12px | 보조 버튼 캡슐 |
| `--r-lg` | 18px | 命盤 카드, 운세 유틸리티 카드 |
| `--r-pill` | 9999px | 기본 액션 버튼, 입력 필드 — 시그니처 pill |
| `--r-full` | 50% | 원형 아이콘 버튼 |

> Apple의 `{rounded.pill}`이 Action Blue와 함께 '클릭하세요' 신호인 것처럼,  
> 이 앱의 `--r-pill`은 `--color-primary`와 함께 '입력·선택하세요' 신호다.

---

## 八. 반응형 & 접근성

### 브레이크포인트

| 이름 | 너비 | 주요 변화 |
|------|------|-----------|
| 소형 폰 | ≤ 400px | 단일 칼럼 / 히어로 타이포 28px로 축소 |
| 폰 | 401–640px | 단일 칼럼 / 命盤 카드 풀폭 |
| 태블릿 세로 | 641–768px | 글로벌 내비 햄버거 전환 |
| 태블릿 가로 | 769–1024px | 2칼럼 카드 그리드 |
| 데스크탑 | 1025–1280px | 3–4칼럼 / 풀 레이아웃 |
| 와이드 | ≥ 1281px | 콘텐츠 폭 1280px 잠금, 여백 흡수 |

### 접근성 원칙

- 모든 인터랙티브 요소 최소 터치 타깃: **44×44px**
- 색상 대비: WCAG AA 이상 (본문 텍스트 최소 4.5:1)
- 포커스 링: `outline: 2px solid var(--color-focus); outline-offset: 2px` 전체 적용
- **한자 장식 요소 전체: `aria-hidden="true"` 처리** — 스크린 리더는 한글 텍스트만 읽음
- 오행 색상만으로 정보 전달 금지 — 반드시 한글 텍스트 병기

---

## 九. 금지 사항 (禁止 목록)

| 금지 | 이유 |
|------|------|
| 장식 CSS 그라디언트 | Apple 원칙: 분위기는 사진 에셋으로 |
| 命盤 카드 외 box-shadow | 그림자는 명반 전용 elevation |
| 두 번째 강조색 도입 | 오행 1색 원칙 위반 |
| 전면 타일에 border-radius | 타일은 edge-to-edge |
| 헤드라인에 weight 300 사용 | 300은 장식·워터마크 전용 |
| 본문 행간 1.50 미만 | 가독성 기준 |
| 다크 타일 위 --color-primary | 반드시 --color-primary-on-dark 사용 |
| 기능 버튼·안내 문구에 한자 | 한자는 디자인 장치 전용 |
| WenKaiKR 이외 폰트 혼용 | 폴백 제외, 시각 통일 |
| 과도한 CSS 애니메이션 | scale(0.96) 트랜스폼, opacity 전환만 허용 |

---

## 十. 한자 사용 레퍼런스 목록

디자인 장치로 허용된 한자 전체 목록. 이외 한자 추가 시 반드시 기획·개발 협의.

| 용도 | 한자 | 한글 독음 | 허용 위치 |
|------|------|----------|---------|
| 앱 브랜드 | 命理 | 명리 | 로고, 푸터 서명 |
| 사주·팔자 | 四柱 八字 | 사주 팔자 | 타일 장식, 워터마크 |
| 천간 10자 | 甲乙丙丁戊己庚辛壬癸 | 갑을병정무기경신임계 | 命盤 카드 내 |
| 지지 12자 | 子丑寅卯辰巳午未申酉戌亥 | 자축인묘진사오미신유술해 | 命盤 카드 내 |
| 오행 아이콘 | 木火土金水 | 목화토금수 | 아이콘 레이블 |
| 주(柱) 명칭 | 年柱 月柱 日柱 時柱 | 연주 월주 일주 시주 | 타일 제목 앞 장식 |
| 운(運) 명칭 | 大運 歲運 | 대운 세운 | 타일 제목 앞 장식 |
| 분석 명칭 | 五行 命盤 | 오행 명반 | 타일 제목 앞 장식 |
| 음양 | 陰陽 | 음양 | 카드 보조 배지 |
| 길흉 | 吉凶 | 길흉 | 운세 카드 배지 |

---

## 구현 체크리스트

### 폰트
- [ ] `font-display: swap` 적용으로 FOUT 방지
- [ ] 크리티컬 경로에 `<link rel="preload">` 추가 (Regular 우선)

### 색상
- [ ] CSS 변수 `--color-primary`가 일간 계산 후 정상 주입되는지 확인
- [ ] 다크 타일 위 링크는 `--color-primary-on-dark` 사용 여부 확인
- [ ] 전체 색상 대비 WCAG AA 통과 확인

### 레이아웃
- [ ] 命盤 카드 그림자가 시스템 내 유일한 elevation인지 확인
- [ ] 타일 섹션 교번 리듬 (light → parchment → dark) 유지 확인
- [ ] 모바일 44px 터치 타깃 확인

### 한자 처리
- [ ] 기능 버튼·안내 문구 내 한자 없음 확인
- [ ] 한자 장식 워터마크 opacity 4–6% 확인
- [ ] 모든 한자 장식 요소에 `aria-hidden="true"` 적용 확인
- [ ] 오행 아이콘 한자 옆 한글 병기 확인
