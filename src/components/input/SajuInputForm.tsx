'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSajuStore } from '@/store/sajuStore';
import { encodeShareUrl } from '@/utils/share';
import type { SajuInput } from '@/store/types';
import Button from '@/components/common/Button';
import styles from './SajuInputForm.module.css';

const HOUR_OPTIONS = [
  { label: '시간 모름', value: -1 },
  { label: '자시 (23:30~01:29)', value: 0 },
  { label: '축시 (01:30~03:29)', value: 2 },
  { label: '인시 (03:30~05:29)', value: 4 },
  { label: '묘시 (05:30~07:29)', value: 6 },
  { label: '진시 (07:30~09:29)', value: 8 },
  { label: '사시 (09:30~11:29)', value: 10 },
  { label: '오시 (11:30~13:29)', value: 12 },
  { label: '미시 (13:30~15:29)', value: 14 },
  { label: '신시 (15:30~17:29)', value: 16 },
  { label: '유시 (17:30~19:29)', value: 18 },
  { label: '술시 (19:30~21:29)', value: 20 },
  { label: '해시 (21:30~23:29)', value: 22 },
];

export default function SajuInputForm() {
  const router = useRouter();
  const { setInput, calculate, isCalculating } = useSajuStore();

  const [year,   setYear  ] = useState('');
  const [month,  setMonth ] = useState('');
  const [day,    setDay   ] = useState('');
  const [hour,   setHour  ] = useState('-1');
  const [gender, setGender] = useState<'남' | '여' | ''>('');
  const [isLunar, setIsLunar] = useState(false);
  const [isLeap,  setIsLeap ] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    const y = parseInt(year), m = parseInt(month), d = parseInt(day);
    if (!year || isNaN(y) || y < 1900 || y > 2100) e.year = '1900~2100 사이의 연도를 입력해주세요.';
    if (!month || isNaN(m) || m < 1 || m > 12) e.month = '1~12 사이의 월을 입력해주세요.';
    if (!day   || isNaN(d) || d < 1 || d > 31) e.day   = '1~31 사이의 일을 입력해주세요.';
    if (!gender) e.gender = '성별을 선택해주세요.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const h = parseInt(hour);
    const input: SajuInput = {
      birthYear: parseInt(year),
      birthMonth: parseInt(month),
      birthDay: parseInt(day),
      birthHour: h === -1 ? null : h,
      birthMinute: h === -1 ? null : 0,
      gender: gender as '남' | '여',
      isLunar,
      isLeapMonth: isLunar && isLeap,
    };
    setInput(input);
    await calculate();
    router.push(encodeShareUrl(input));
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {/* 양음력 토글 */}
      <div className={styles.calToggle}>
        <button type="button"
          className={`${styles.calBtn} ${!isLunar ? styles.active : ''}`}
          onClick={() => setIsLunar(false)}>양력</button>
        <button type="button"
          className={`${styles.calBtn} ${isLunar ? styles.active : ''}`}
          onClick={() => setIsLunar(true)}>음력</button>
      </div>

      {/* 날짜 입력 */}
      <fieldset className={styles.dateGroup}>
        <legend className={styles.legend}>생년월일</legend>
        <div className={styles.dateRow}>
          <div className={styles.fieldWrap}>
            <input type="number" id="year" inputMode="numeric"
              className={`${styles.input} ${errors.year ? styles.inputErr : ''}`}
              placeholder="년도 (예: 1990)" value={year}
              onChange={e => setYear(e.target.value)} min="1900" max="2100" />
            {errors.year && <p className={styles.errMsg} role="alert">{errors.year}</p>}
          </div>
          <div className={styles.fieldWrap}>
            <input type="number" id="month" inputMode="numeric"
              className={`${styles.input} ${errors.month ? styles.inputErr : ''}`}
              placeholder="월 (1~12)" value={month}
              onChange={e => setMonth(e.target.value)} min="1" max="12" />
            {errors.month && <p className={styles.errMsg} role="alert">{errors.month}</p>}
          </div>
          <div className={styles.fieldWrap}>
            <input type="number" id="day" inputMode="numeric"
              className={`${styles.input} ${errors.day ? styles.inputErr : ''}`}
              placeholder="일 (1~31)" value={day}
              onChange={e => setDay(e.target.value)} min="1" max="31" />
            {errors.day && <p className={styles.errMsg} role="alert">{errors.day}</p>}
          </div>
        </div>
        {isLunar && (
          <label className={styles.leapLabel}>
            <input type="checkbox" checked={isLeap} onChange={e => setIsLeap(e.target.checked)} />
            윤달 여부
          </label>
        )}
      </fieldset>

      {/* 시간 */}
      <div className={styles.fieldWrap}>
        <label htmlFor="hour" className={styles.label}>태어난 시간</label>
        <select id="hour" className={styles.select} value={hour} onChange={e => setHour(e.target.value)}>
          {HOUR_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {parseInt(hour) === -1 && (
          <p className={styles.hint}>시간을 모르면 시주(時柱)가 생략됩니다.</p>
        )}
      </div>

      {/* 성별 */}
      <fieldset className={styles.genderGroup}>
        <legend className={styles.legend}>성별</legend>
        <div className={styles.genderRow}>
          {(['남', '여'] as const).map(g => (
            <button key={g} type="button"
              className={`${styles.genderBtn} ${gender === g ? styles.active : ''}`}
              onClick={() => setGender(g)}
              aria-pressed={gender === g}>
              {g === '남' ? '남성' : '여성'}
            </button>
          ))}
        </div>
        {errors.gender && <p className={styles.errMsg} role="alert">{errors.gender}</p>}
      </fieldset>

      <Button type="submit" disabled={isCalculating} className={styles.submitBtn}>
        {isCalculating ? '계산 중...' : '사주 보기'}
      </Button>
    </form>
  );
}
