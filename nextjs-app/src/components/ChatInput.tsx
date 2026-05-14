'use client';
import { useState, useRef, useCallback, KeyboardEvent } from 'react';
import styles from './ChatInput.module.css';

interface Props {
  onSend: (value: string) => void;
  disabled: boolean;
}

const MAX_CHARS = 2000;

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 180) + 'px';
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > MAX_CHARS) return;
    setValue(e.target.value);
    autoResize();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const submit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  }, [value, disabled, onSend]);

  const pct = (value.length / MAX_CHARS) * 100;
  const nearLimit = value.length > MAX_CHARS * 0.85;

  return (
    <footer className={styles.footer}>
      <form
        className={styles.form}
        onSubmit={(e) => { e.preventDefault(); submit(); }}
        aria-label="Chat input form"
      >
        <div className={`${styles.inputBox} ${disabled ? styles.inputBoxDisabled : ''}`}>
          <textarea
            ref={textareaRef}
            id="chat-input"
            className={styles.textarea}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything… (Shift+Enter for new line)"
            rows={1}
            disabled={disabled}
            aria-label="Chat message input"
            aria-describedby="char-count"
          />

          {/* Progress ring when near limit */}
          {nearLimit && (
            <span id="char-count" className={styles.charCount} aria-label={`${value.length} of ${MAX_CHARS} characters used`}>
              {MAX_CHARS - value.length}
            </span>
          )}

          <button
            type="submit"
            className={`${styles.sendBtn} ${(!value.trim() || disabled) ? styles.sendBtnDisabled : styles.sendBtnActive}`}
            disabled={!value.trim() || disabled}
            aria-label="Send message"
          >
            {disabled ? (
              <span className={styles.spinner} aria-hidden="true" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22 11 13 2 9l20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>

        {/* Progress bar */}
        <div
          className={styles.progress}
          style={{ width: `${pct}%`, opacity: nearLimit ? 1 : 0 }}
          role="progressbar"
          aria-valuenow={value.length}
          aria-valuemax={MAX_CHARS}
        />

        <p className={styles.hint}>
          Press <kbd>Enter</kbd> to send · <kbd>Shift+Enter</kbd> for new line
        </p>
      </form>
    </footer>
  );
}
