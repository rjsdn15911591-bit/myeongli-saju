'use client';

import { useState } from 'react';
import HanjaGlyph from '@/components/common/HanjaGlyph';
import styles from './page.module.css';

export default function BoothPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      {/* 히어로 */}
      <section className={`tile-light ${styles.hero}`}>
        <div className="container">
          <div className={styles.heroInner}>
            <HanjaGlyph char="緣" size="tile" opacity={0.06} className={styles.heroWatermark} />
            <p className={styles.eyebrow}>사주가 점지한 그 인연을 직접 만나세요</p>
            <h1 className={styles.headline}>소개팅 부스</h1>
            <p className={styles.sub}>
              命理 사주가 암시한 인연,<br />
              지금 바로 현장에서 확인해보세요.
            </p>
          </div>
        </div>
      </section>

      {/* 위치 안내 */}
      <section className={`tile-parchment ${styles.locationSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <HanjaGlyph char="處" style={{ fontSize: '36px', color: 'var(--color-primary)', opacity: 0.6 }} />
            <h2 className={styles.sectionTitle}>부스 위치</h2>
          </div>
          <div className={styles.locationCard}>
            <div className={styles.boothBadge}>
              <span className={styles.boothNumber}>22</span>
              <span className={styles.boothLabel}>번 부스</span>
            </div>
            <div className={styles.locationMeta}>
              <span className={styles.locationTag}>학생 부스 구역</span>
              <span className={styles.locationTag}>넉넉한 터</span>
              <span className={styles.locationTag}>피우리오 2026</span>
            </div>
            <button
              className={styles.mapWrapper}
              onClick={() => setLightboxOpen(true)}
              aria-label="배치도 전체화면으로 보기"
            >
              <img
                src="/booth-map.webp"
                alt="피우리오 전체 부스 배치도 — 22번 위치"
                className={styles.mapImage}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.style.display = 'flex';
                }}
              />
              <div className={styles.mapPlaceholder} style={{ display: 'none' }}>
                <span className={styles.mapPlaceholderIcon}>🗺</span>
                <p>부스 배치도 준비 중입니다</p>
              </div>
              <div className={styles.mapZoomHint}>
                <span>🔍 눌러서 크게 보기</span>
              </div>
            </button>
            <div className={styles.locationNote}>
              <p>
                배치도에서 <strong>초록색 테두리</strong>로 표시된 <strong>학생 부스</strong> 구역을 찾아주세요.<br />
                그 구역 안 <strong>왼쪽 아래</strong>에 위치한 <strong>22번 부스</strong>가 바로 저희 소개팅 부스입니다!<br />
                배치도를 누르면 크게 확인하실 수 있어요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 현장 사진 */}
      <section className={`tile-light ${styles.photoSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <HanjaGlyph char="影" style={{ fontSize: '36px', color: 'var(--color-primary)', opacity: 0.6 }} />
            <h2 className={styles.sectionTitle}>현장 사진</h2>
          </div>
          <PhotoGallery />
        </div>
      </section>

      {/* 라이트박스 */}
      {lightboxOpen && (
        <div
          className={styles.lightboxOverlay}
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="배치도 전체화면"
        >
          <button className={styles.lightboxClose} onClick={() => setLightboxOpen(false)} aria-label="닫기">✕</button>
          <img
            src="/booth-map.webp"
            alt="피우리오 전체 부스 배치도"
            className={styles.lightboxImage}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

const PHOTO_FILES = [
  '/booth-photos/photo1.jpg',
  '/booth-photos/photo2.jpg',
  '/booth-photos/photo3.jpg',
  '/booth-photos/photo4.jpg',
  '/booth-photos/photo5.jpg',
  '/booth-photos/photo6.jpg',
];

function PhotoGallery() {
  return (
    <div className={styles.photoGrid}>
      {PHOTO_FILES.map((src, i) => (
        <div key={i} className={styles.photoItem}>
          <img
            src={src}
            alt={`소개팅 부스 현장 사진 ${i + 1}`}
            className={styles.photo}
            onError={(e) => {
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) {
                parent.innerHTML = '';
                parent.classList.add(styles.photoPlaceholder);
                parent.setAttribute('aria-hidden', 'true');
              }
            }}
          />
        </div>
      ))}
    </div>
  );
}
