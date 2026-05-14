# Nexus AI - Multi-Framework Chat Application

This repository contains three implementations of a modern AI chat interface, as requested for the FFind Frontend Engineer assessment.

## Project Structure

- `/nextjs-app`: **Primary Implementation** using Next.js 15 (App Router), TypeScript, Tailwind CSS, and Jest.
- `/nuxtjs-app`: Nuxt 3 implementation using Vue 3 Composition API.
- `/angular-app`: Angular 19+ implementation using Standalone Components and RxJS.

## Features Across All Versions

- **OpenAI Integration**: Powered by OpenAI's GPT-4o model.
- **Rich UI/UX**: Custom design system with glassmorphism, smooth animations, and responsive layout.
- **Persistent History**: Chat sessions are saved to `localStorage` and persist between reloads.
- **Markdown Support**: AI responses render code snippets, tables, and formatted text correctly.
- **Robust State Management**: Handling of loading skeletons, typing indicators, and comprehensive error states.
- **Session Management**: "Clear Chat" functionality to reset the current session.

## Getting Started

### 1. Requirements
- Node.js 18.x or higher
- npm or yarn
- An OpenAI API Key (Get one at [OpenAI Dashboard](https://platform.openai.com/api-keys))

### 2. Configuration
Create a `.env.local` file in the respective project root (see `.env.example` in `nextjs-app`) and add:
```env
OPENAI_API_KEY=your_key_here
```

### 3. Installation & Running

#### Next.js
```bash
cd nextjs-app
npm install
npm run dev
# Run tests
npm test
```

#### Nuxt
```bash
cd nuxtjs-app
npm install
npm run dev
```

#### Angular
```bash
cd angular-app
npm install
npm start
```

## Implementation Notes

I prioritized a "premium" aesthetic across all versions, using a shared design language (CSS Variables) to ensure consistency while respecting the idiomatic patterns of each framework.

- **Next.js**: Leverages Server Components/Actions/Route Handlers for secure API key management.
- **Nuxt**: Uses Nitro server routes for the same security benefits.
- **Angular**: Demonstrates service-based architecture and RxJS streams.

---
*Created for the FFind Frontend Engineer Assessment.*
