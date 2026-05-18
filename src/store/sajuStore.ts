'use client';

import { create } from 'zustand';
import type { SajuInput, SajuResult, OHaeng } from './types';
import { CHEONGAN_ATTR } from '@/core/saju/ganji';

interface SajuStore {
  input: SajuInput | null;
  setInput: (input: SajuInput) => void;
  result: SajuResult | null;
  isCalculating: boolean;
  error: string | null;
  calculate: () => Promise<void>;
  reset: () => void;
  activeSection: string;
  setActiveSection: (id: string) => void;
  selectedDaeunAge: number | null;
  setSelectedDaeunAge: (age: number | null) => void;
  selectedSeunYear: number;
  setSelectedSeunYear: (year: number) => void;
}

function injectOhaengTheme(ohaeng: OHaeng) {
  const MAP: Record<OHaeng, { primary: string; onDark: string }> = {
    '木': { primary: '#2d6a4f', onDark: '#52b788' },
    '火': { primary: '#b83c10', onDark: '#e07a5f' },
    '土': { primary: '#8b6914', onDark: '#d4a853' },
    '金': { primary: '#4a5568', onDark: '#a0aec0' },
    '水': { primary: '#1a3a5c', onDark: '#4a90d9' },
  };
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--color-primary', MAP[ohaeng].primary);
  root.style.setProperty('--color-primary-on-dark', MAP[ohaeng].onDark);
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
      const { computeSajuResult } = await import('@/core/calendar/manseryeok');
      const result = computeSajuResult(input);
      const dayOhaeng = CHEONGAN_ATTR[result.pillars.day.gan].ohaeng;
      injectOhaengTheme(dayOhaeng);
      set({ result, isCalculating: false });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error('[calculate] error:', msg, e);
      set({ error: `계산 중 오류가 발생했습니다: ${msg}`, isCalculating: false });
    }
  },

  reset: () => set({ input: null, result: null, error: null }),
  setActiveSection: (id) => set({ activeSection: id }),
  setSelectedDaeunAge: (age) => set({ selectedDaeunAge: age }),
  setSelectedSeunYear: (year) => set({ selectedSeunYear: year }),
}));
