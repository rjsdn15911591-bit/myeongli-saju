import type { CheonGan, JiJi, OHaeng, EumYang } from '@/store/types';

export const CHEONGAN_ORDER: CheonGan[] = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
export const JIJI_ORDER: JiJi[] = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

export const CHEONGAN_ATTR: Record<CheonGan, { ohaeng: OHaeng; eumyang: EumYang; korName: string }> = {
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

export const JIJI_ATTR: Record<JiJi, { ohaeng: OHaeng; eumyang: EumYang; season: string; korName: string; monthIndex: number }> = {
  '子': { ohaeng: '水', eumyang: '陽', season: '겨울', korName: '자', monthIndex: 11 },
  '丑': { ohaeng: '土', eumyang: '陰', season: '겨울', korName: '축', monthIndex: 12 },
  '寅': { ohaeng: '木', eumyang: '陽', season: '봄',   korName: '인', monthIndex: 1 },
  '卯': { ohaeng: '木', eumyang: '陰', season: '봄',   korName: '묘', monthIndex: 2 },
  '辰': { ohaeng: '土', eumyang: '陽', season: '봄',   korName: '진', monthIndex: 3 },
  '巳': { ohaeng: '火', eumyang: '陰', season: '여름', korName: '사', monthIndex: 4 },
  '午': { ohaeng: '火', eumyang: '陽', season: '여름', korName: '오', monthIndex: 5 },
  '未': { ohaeng: '土', eumyang: '陰', season: '여름', korName: '미', monthIndex: 6 },
  '申': { ohaeng: '金', eumyang: '陽', season: '가을', korName: '신', monthIndex: 7 },
  '酉': { ohaeng: '金', eumyang: '陰', season: '가을', korName: '유', monthIndex: 8 },
  '戌': { ohaeng: '土', eumyang: '陽', season: '가을', korName: '술', monthIndex: 9 },
  '亥': { ohaeng: '水', eumyang: '陰', season: '겨울', korName: '해', monthIndex: 10 },
};

// 사주 월 지지 순서 (寅월=1, 卯월=2, ...)
export const MONTH_JIJI: JiJi[] = ['寅','卯','辰','巳','午','未','申','酉','戌','亥','子','丑'];

// 오행 생극 관계
export const GENERATING: Record<OHaeng, OHaeng> = { '木':'火','火':'土','土':'金','金':'水','水':'木' };
export const OVERCOMING: Record<OHaeng, OHaeng> = { '木':'土','土':'水','水':'火','火':'金','金':'木' };
