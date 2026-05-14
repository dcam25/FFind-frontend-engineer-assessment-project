# Nuxt.js Chat Application

A Nuxt Minimal Starter architected to facilitate a fast, dynamic AI chat interface fulfilling the assessment challenges.

## Deployed Environments
- **Next.js**: [https://nexus-ai-chat-nextjs.vercel.app/](https://nexus-ai-chat-nextjs.vercel.app/)
- **Nuxt.js**: [https://nexus-ai-chat-nuxtjs.vercel.app/](https://nexus-ai-chat-nuxtjs.vercel.app/)
- **Angular**: [https://nexus-ai-chat-angular.vercel.app/](https://nexus-ai-chat-angular.vercel.app/)

> **Note on Architecture:** The local and deployed Angular projects are currently utilizing the deployed Next.js project's edge API (`https://nexus-ai-chat-nextjs.vercel.app/api/chat`) via proxy configurations.

## Assessment Objectives Met

### 🟢 Core Requirements
- **User Interface**: Polished UI integrating clean chat bubbles, message inputs, and action buttons.
- **API Integration**: Fetching and interacting natively with Generative AI APIs.
- **Dynamic Rendering**: Vue's dynamic virtual DOM renders conversational histories safely on the fly without structural reloads.
- **State Management**: Built robust loaders and gracefully handled edge cases (timeouts, rate-limiters) and dynamic spinners utilizing Vue composables.
- **Best Practices**: Constructed cleanly via Vue SFCs (Single File Components), ensuring separated concerns (scripts, templates, and styles), semantic markup, and responsive structural CSS that resolves standard float/overlap issues.

### 🌟 Bonus Challenges Completed
- **Persistent Chat History**: Previous prompts and responses stay anchored natively for reference throughout the interactive session loop.
- **Session Management**: Clean mechanisms implemented for triggering a fast, active wipe of the current message history pipeline via straightforward state resetting.
- **Markdown Support**: Native component mapping allowing inline code block parsing directly from the generative LLM response format.

## Technical Refinements & Logic

- **Resolving Nuxt Sonner CSS Issues**: Explicitly tackled and resolved an environment build-time failure triggered by faulty standard `vue-sonner` integrations to ensure continuous successful builds.
- **Advanced UI Alignments**: Standardized margins, responsive boundaries, and Markdown components to provide a "premium"-tier environment matching large commercial interfaces.

## Setup

Make sure to install dependencies first:

```bash
npm install
# or yarn / pnpm / bun
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```
