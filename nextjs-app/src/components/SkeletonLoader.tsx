import styles from './SkeletonLoader.module.css';

export default function SkeletonLoader() {
  return (
    <div className={`${styles.wrapper} animate-in`} role="status" aria-label="AI is responding">
      <div className={styles.avatar}>✦</div>
      <div className={styles.card}>
        <div className={styles.lines}>
          <div className={`${styles.line} ${styles.long}`} />
          <div className={`${styles.line} ${styles.medium}`} />
          <div className={`${styles.line} ${styles.short}`} />
        </div>
        <div className={styles.typing}>
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
