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
