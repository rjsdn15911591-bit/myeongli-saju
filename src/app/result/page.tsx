import { Suspense } from 'react';
import ResultContent from './ResultContent';

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '24px', fontFamily: 'var(--font-primary)', color: 'var(--ink-muted-80)', fontSize: '18px' }}>
        <span style={{ fontSize: '48px', fontWeight: 300, color: 'var(--color-primary)', opacity: 0.6 }}>命</span>
        <p>사주를 불러오고 있습니다…</p>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
