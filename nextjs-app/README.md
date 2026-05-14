# Next.js Chat Application

This is a [Next.js](https://nextjs.org) project bootstrapped with `create-next-app` designed as a generative AI chat interface, completing the assessment challenge requirements.

## Deployed Environments
- **Next.js**: [https://nexus-ai-chat-nextjs.vercel.app/](https://nexus-ai-chat-nextjs.vercel.app/)
- **Nuxt.js**: [https://nexus-ai-chat-nuxtjs.vercel.app/](https://nexus-ai-chat-nuxtjs.vercel.app/)
- **Angular**: [https://nexus-ai-chat-angular.vercel.app/](https://nexus-ai-chat-angular.vercel.app/)

> **Note on Architecture:** The local and deployed Angular projects are currently utilizing the deployed Next.js project's edge API (`https://nexus-ai-chat-nextjs.vercel.app/api/chat`) via proxy configurations.

## Assessment Objectives Met

### 🟢 Core Requirements
- **User Interface**: Features a clean, intuitive text input field and submit functionality natively rendered with React.
- **API Integration**: Integrates directly with a generative AI API to stream content token-by-token.
- **Dynamic Rendering**: Real-time response rendering injected dynamically into the DOM without page reloads.
- **State Management**: Robust implementations using React Hooks (`useState`, `useEffect`) manage loading spinners, typing indicators, empty prompts, and stream error fallbacks gracefully.
- **Best Practices**: Utilizes a highly modular component-based architecture (e.g., `ChatWindow.tsx`), modern semantic HTML wrappers, and fully responsive CSS modules.

### 🌟 Bonus Challenges Completed
- **Persistent Chat History**: Session and historical message persistence implemented dynamically so chats are retained.
- **Session Management**: Seamless "Clear Chat" and structured session UI boundaries developed to wipe or reset environments.
- **Markdown Support**: Leveraged Markdown React integrations to correctly parse and style code snippets directly from the AI response safely.
- **Optimized Chat Scroll UX**: As an added implementation, introduced a "smart scroll" mechanism to stop the screen from hijacking the user if they scroll up during a live generation.

## Technical Refinements & Logic

- **Event Listener Cleanup**: Correctly implemented standard DOM event cleanup (`window.removeEventListener`) to avoid memory leak conditions when capturing component hotkeys.
- **Decoding Streaming Text**: Refined token chunk mapping via `decoder.decode(value, { stream: true })` for lightning-fast responsive interface feedback.

## Getting Started

First, run the local Next.js instance:

```bash
npm run dev
# or yarn dev / pnpm dev / bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience the environment.
