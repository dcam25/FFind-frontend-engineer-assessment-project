# Nexus AI - FFind Frontend Engineer Assessment

This repository contains three distinct implementations of a modern Generative AI chat interface, built to demonstrate proficiency across the three major frontend frameworks: Next.js, Nuxt.js, and Angular. The project validates clean UI design, direct streaming API integrations, dynamic rendering without reloads, extensive state handling (skeletons/indicators), and semantic component architectures.

## 🚀 Live Deployed Environments

Visitors can easily explore and interact with the deployed applications through the links below:

- **Next.js Implementation:** [https://nexus-ai-chat-nextjs.vercel.app/](https://nexus-ai-chat-nextjs.vercel.app/)
- **Nuxt.js Implementation:** [https://nexus-ai-chat-nuxtjs.vercel.app/](https://nexus-ai-chat-nuxtjs.vercel.app/)
- **Angular Implementation:** [https://nexus-ai-chat-angular.vercel.app/](https://nexus-ai-chat-angular.vercel.app/)

> **Note on Architecture:** The local and deployed Angular applications, as well as the Nuxt.js app, are currently utilizing the deployed Next.js project's edge function API (`https://nexus-ai-chat-nextjs.vercel.app/api/chat`) via proxy configurations. This guarantees stable, synchronized backend behavior across all frameworks. 

## Project Structure

- `/nextjs-app`: **Primary Implementation** using Next.js (App Router), TypeScript, Tailwind CSS, and Jest.
- `/nuxtjs-app`: Nuxt 3 implementation using Vue 3 Composition API.
- `/angular-app`: Angular 19+ implementation using Standalone Components and RxJS.

## Features Across All Versions

- **OpenAI Integration**: Powered by OpenAI's API returning token-by-token readable streams.
- **Rich UI/UX**: Custom design system with modern message alignments, smooth animations, and responsive layout.
- **Persistent History**: Chat sessions are saved dynamically to state and persist across the active flow to keep prompts visible.
- **Markdown Support**: AI responses render code snippets, tables, and formatted text directly with inline copying mechanisms.
- **Robust State Management**: Handled timeout handling, loading skeletons, typing indicators, and empty prompt fallbacks.
- **Session Management**: Distinct "Clear Chat" functionalities integrated to quickly wipe current interaction scopes.

## Getting Started

### 1. Requirements
- Node.js 18.x or higher
- npm, yarn, or bun
- **IMPORTANT**: To run the applications locally un-proxied, you will need an OpenAI API Key. However, because of the cross-application proxy to the Next.js edge endpoint, you can frequently run the frontend components locally without directly needing your own API key.

### 2. Installation, Running, & Testing

Each project provides standard framework-specific development servers and unit testing scaffolding.

#### 🔵 Next.js
```bash
cd nextjs-app
npm install
npm run dev

# Run unit tests natively
npm run test
```

#### 🟢 Nuxt.js
```bash
cd nuxtjs-app
npm install
npm run dev

# Run unit tests
npm run test
```

#### 🔴 Angular
```bash
cd angular-app
npm install
npm run start

# Run unit tests with Vitest integration
npm run test 
# (or execute simply using `ng test`)
```

---

## Detailed Framework Walkthroughs

The following sections contain the direct, extensive `README.md` entries specifically crafted for each project's environment.

<details>
<summary><h3>🔵 Next.js Project Details</h3></summary>

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

</details>

<details>
<summary><h3>🟢 Nuxt.js Project Details</h3></summary>

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

</details>

<details>
<summary><h3>🔴 Angular Project Details</h3></summary>

# Angular Chat Application

This implementation was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.10 and designed to address the Generative AI Assessment objectives.

## Deployed Environments
- **Next.js**: [https://nexus-ai-chat-nextjs.vercel.app/](https://nexus-ai-chat-nextjs.vercel.app/)
- **Nuxt.js**: [https://nexus-ai-chat-nuxtjs.vercel.app/](https://nexus-ai-chat-nuxtjs.vercel.app/)
- **Angular**: [https://nexus-ai-chat-angular.vercel.app/](https://nexus-ai-chat-angular.vercel.app/)

> **Note on Architecture:** The local and deployed Angular projects are currently utilizing the deployed Next.js project's edge API (`https://nexus-ai-chat-nextjs.vercel.app/api/chat`) via proxy configurations.

## Assessment Objectives Met

### 🟢 Core Requirements
- **User Interface**: Angular components handle a highly responsive, clean form and submission mapping.
- **API Integration**: Extracted fetching mechanisms directly addressing the external LLM APIs safely.
- **Dynamic Rendering**: Token streams dynamically append into native view changes using pure Angular bindings without reloading components.
- **State Management**: Full implementation of localized state variables dictating connection status, UI timeout indicators, loading skeletons, and validation bounds.
- **Best Practices**: Leverages Angular's strict, opinionated Service/Component design structure along with encapsulated component CSS and standard HTML interfaces.

### 🌟 Bonus Challenges Completed
- **Persistent Chat History**: Session maps retain and re-hydrate history logs continuously based on user active sessions.
- **Session Management**: Action hooks tied natively to empty the chat buffer ("Reset/Clear" functionalities).
- **Markdown Support & Snippet Tools**: Full Markdown tokenization supporting rich text blocks. Expanded upon this by natively implementing a **"Copy Code Block"** functionality.
- **Unit Testing Engine Availability**: Native scaffolding hooks standard tests (`ng test`) implemented and maintained within the broader structural build architecture.

## Technical Refinements & Logic

- **Resolving Angular Streaming Delays**: Implemented an explicit bypass of local Webpack proxy buffering (by mapping `proxy.conf.json` targets directly dynamically). Angular CLI has a known legacy HTTP buffering issue with streaming; this logical override resolves the streaming bottleneck ensuring true "token-by-token" UX instead of full-batch delivery.
- **Strict Service Architecture**: Reorganized `chat.service.ts` into a unified HTTP coordination point for the overall lifecycle of the AI responses to increase testing predictability and clean up the component class controllers.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component.

## Building & Testing

To build the project run:

```bash
ng build
```

To execute unit tests matching boilerplate integration standards:

```bash
ng test
```

</details>

---
*Created for the FFind Frontend Engineer Assessment.*
