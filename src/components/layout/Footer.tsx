import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <span aria-hidden="true" className={styles.brandHanja}>命理</span>
          <span className={styles.brandKor}> 사주</span>
        </div>
        <nav className={styles.links} aria-label="푸터 내비게이션">
          <div className={styles.col}>
            <p className={styles.colHead}>서비스</p>
            <a href="/">사주 보기</a>
            <a href="/about">서비스 소개</a>
            <a href="/glossary">용어 사전</a>
          </div>
          <div className={styles.col}>
            <p className={styles.colHead}>안내</p>
            <span className={styles.muted}>명리 계산은 모두 브라우저에서 실행됩니다.</span>
            <span className={styles.muted}>개인정보를 저장하지 않습니다.</span>
          </div>
        </nav>
        <p className={styles.legal}>
          본 서비스는 명리학 연구 목적으로 제공되며, 의료·법률·재무 조언이 아닙니다.
          해석 결과는 경향과 가능성을 제시하며 개인의 판단과 책임을 대신하지 않습니다.
        </p>
      </div>
    </footer>
  );
}
