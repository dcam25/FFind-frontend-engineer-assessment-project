'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';
import type { ChatMessage } from '@/types/chat';
import styles from './MessageBubble.module.css';

interface Props {
  message: ChatMessage;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div id={message.id} className={`${styles.wrapper} ${isUser ? styles.userWrapper : styles.aiWrapper} animate-in`}>
      {!isUser && (
        <div className={styles.avatar} aria-hidden="true">✦</div>
      )}
      <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.aiBubble} ${message.isError ? styles.errorBubble : ''}`}>
        {isUser ? (
          <p className={styles.userText}>{message.content}</p>
        ) : (
          <div className="markdown-body">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeValue = String(children).replace(/\n$/, '');
                  
                  if (!inline && match) {
                    return (
                      <div className={styles.codeWrapper}>
                        <div className={styles.codeHeader}>
                          <span className={styles.codeLang}>{match[1]}</span>
                          <button 
                            className={styles.copyBtn}
                            onClick={() => {
                              navigator.clipboard.writeText(codeValue);
                              toast.success('Copied to clipboard');
                            }}
                          >
                            Copy
                          </button>
                        </div>
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </div>
                    );
                  }
                  return <code className={className} {...props}>{children}</code>;
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        <time className={styles.time} dateTime={new Date(message.timestamp).toISOString()}>
          {time}
        </time>
      </div>
      {isUser && (
        <div className={styles.avatarUser} aria-hidden="true">U</div>
      )}
    </div>
  );
}
