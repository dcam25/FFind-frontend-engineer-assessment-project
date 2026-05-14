<template>
  <div class="wrapper aiWrapper animate-in">
    <div class="avatar" aria-hidden="true">✦</div>
      <div class="bubble aiBubble">
        <div class="typing">
          <span />
          <span />
          <span />
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  padding: 0.75rem 0;
  justify-content: flex-start;
  flex-shrink: 0;
  width: 100%
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c6af7, #a78bfa);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  flex-shrink: 0;
  box-shadow: 0 0 12px rgba(124,106,247,0.4);
}

.bubble {
  max-width: min(78%, 640px);
  padding: 0.85rem 1.1rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  border-top-left-radius: var(--radius-sm);
  background: var(--ai-bubble);
}

.typing {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}

.typing span {
  width: 6px;
  height: 6px;
  background: var(--text-muted);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing span:nth-child(1) { animation-delay: -0.32s; }
.typing span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
  40% { transform: scale(1); opacity: 1; }
}

.animate-in {
  animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
