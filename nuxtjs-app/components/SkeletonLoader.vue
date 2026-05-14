<template>
  <div class="wrapper animate-in" role="status" aria-label="AI is responding">
    <div class="avatar">✦</div>
    <div class="card">
      <div class="lines">
        <div class="line long" />
        <div class="line medium" />
        <div class="line short" />
      </div>
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
  align-items: flex-end;
  gap: 0.6rem;
  padding: 0.25rem 0;
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
  animation: pulse 1.5s ease infinite;
}
.card {
  background: var(--ai-bubble);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  border-bottom-left-radius: var(--radius-sm);
  padding: 1rem 1.2rem;
  min-width: 200px;
}
.lines { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.75rem; }
.line {
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-input) 50%, var(--bg-tertiary) 75%);
  background-size: 600px 100%;
  animation: shimmer 1.5s infinite linear;
}
.long   { width: 85%; }
.medium { width: 65%; }
.short  { width: 45%; }

.typing {
  display: flex;
  align-items: center;
  gap: 4px;
}
.typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-primary);
  animation: pulse 1.2s ease-in-out infinite;
}
.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
@keyframes shimmer {
  0% { background-position: -600px 0; }
  100% { background-position: 600px 0; }
}
</style>
