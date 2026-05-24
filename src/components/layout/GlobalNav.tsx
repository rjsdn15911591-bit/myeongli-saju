'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './GlobalNav.module.css';

export default function GlobalNav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className={styles.nav} role="navigation" aria-label="전체 내비게이션">
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="명리 사주 홈으로">
          <span aria-hidden="true" className={styles.brandHanja}>命理</span>
          <span className={styles.brandKor}>사주</span>
        </Link>
        <div className={`${styles.links} ${open ? styles.open : ''}`}>
          <Link href="/" className={styles.link} onClick={() => setOpen(false)}>사주 보기</Link>
          <Link href="/booth" className={`${styles.link} ${styles.linkHighlight}`} onClick={() => setOpen(false)}>소개팅 부스</Link>
          <Link href="/about" className={styles.link} onClick={() => setOpen(false)}>소개</Link>
          <Link href="/glossary" className={styles.link} onClick={() => setOpen(false)}>용어 사전</Link>
        </div>
        <button
          className={styles.hamburger}
          onClick={() => setOpen(v => !v)}
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
