import styles from './MessageBubble.module.css';

export default function TypingIndicator() {
  return (
    <div className={`${styles.wrapper} ${styles.aiWrapper} animate-in`}>
      <div className={styles.avatar} aria-hidden="true">✦</div>
      <div className={`${styles.bubble} ${styles.aiBubble}`}>
        <div className={styles.typing}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}
