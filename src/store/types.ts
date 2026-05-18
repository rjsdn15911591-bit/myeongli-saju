export type CheonGan = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
export type JiJi = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';
export type OHaeng = '木' | '火' | '土' | '金' | '水';
export type EumYang = '陰' | '陽';

export interface GanJi {
  gan: CheonGan;
  ji: JiJi;
}

export interface SaJuPillar {
  year: GanJi;
  month: GanJi;
  day: GanJi;
  hour: GanJi | null;
}

export type ShinShin =
  | '비견' | '겁재' | '식신' | '상관'
  | '편재' | '정재' | '편관' | '정관'
  | '편인' | '정인';

export interface SajuInput {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number | null;
  birthMinute: number | null;
  gender: '남' | '여';
  isLunar: boolean;
  isLeapMonth: boolean;
}

export interface OHaengDistribution {
  木: number;
  火: number;
  土: number;
  金: number;
  水: number;
}

export interface YongShin {
  yongShin: OHaeng;
  huiShin: OHaeng;
  giShin: OHaeng;
  guShin: OHaeng;
  hanShin: OHaeng;
  isGangShin: boolean;
}

export interface DaeunItem {
  startAge: number;
  endAge: number;
  pillar: GanJi;
}

export interface RelationResult {
  type: '천간합' | '삼합' | '육합' | '충' | '방합' | '형' | '파' | '해';
  elements: (CheonGan | JiJi)[];
  resultOhaeng?: OHaeng;
  description: string;
}

export interface ShinShinMap {
  [key: string]: ShinShin;
}

export interface MonthFortune {
  label: string;          // "5월 (癸巳月)"
  ganJi: GanJi;
  meetingChance: number;  // 50–95
  keyword: string;
  message: string;
}

export interface SpouseStats {
  wealth: number;
  ability: number;
  affection: number;
  lifespan: number;
  humor: number;
  faceType: string;
  tetoEgen: '테토' | '에겐';
  spouseOhaeng: string;
  wealthText: string;
  abilityText: string;
  affectionText: string;
  lifespanText: string;
  humorText: string;
  specialChars: string;
  monthFortune: MonthFortune[];
  overallFortune: string;
}

export interface SajuResult {
  input: SajuInput;
  pillars: SaJuPillar;
  ohaeng: OHaengDistribution;
  yongShin: YongShin;
  daeunList: DaeunItem[];
  daeunStartAge: number;
  isForward: boolean;
  currentDaeun: DaeunItem | null;
  currentYear: GanJi;
  currentMonth: GanJi;
  relations: RelationResult[];
  shinShinMap: ShinShinMap;
  personalityText: string;
  careerText: string;
  spouseStats: SpouseStats;
  strengthText: string;
}
