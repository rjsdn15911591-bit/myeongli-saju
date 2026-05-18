'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './DetailAccordion.module.css';

interface Props {
  children: React.ReactNode;
  label?: string;
  variant?: 'light' | 'dark';
}

export default function DetailAccordion({
  children,
  label = '자세히 보기',
  variant = 'light',
}: Props) {
  const [open, setOpen] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (open && innerRef.current) {
      setHeight(innerRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [open]);

  return (
    <div className={`${styles.wrap} ${styles[variant]}`}>
      <button
        className={styles.trigger}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        type="button"
      >
        <span className={styles.triggerLabel}>{open ? '접기' : label}</span>
        <svg
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          width="14" height="14" viewBox="0 0 14 14"
          fill="none" aria-hidden="true"
        >
          <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.6"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        className={styles.body}
        style={{ maxHeight: height }}
        aria-hidden={!open}
      >
        <div ref={innerRef} className={styles.bodyInner}>
          {children}
        </div>
      </div>
    </div>
  );
}
