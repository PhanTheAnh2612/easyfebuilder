## Plan: Landing Page Builder Platform (ezfebuilder)

Build a platform enabling small businesses to create landing pages via template selection and content customization, with AI-powered custom component generation using Radix UI headless primitives.

### Steps

1. **Initialize monorepo structure** — Set up pnpm workspaces with `/apps/web` (React + Vite), `/apps/api` (Node.js + Express), `/packages/shared` (types), `/packages/component-library` (Radix UI primitives), and `/packages/ai-specs` (AI-generated specs).

2. **Build template system** — Create template registry in `/apps/web/src/templates/` with section-based architecture. Each template contains reusable sections (hero, features, pricing, CTA, footer) with `editableFields` configuration for content customization.

3. **Create Radix UI component library** — Implement headless primitives in `/packages/component-library/` wrapping Radix UI components (`Dialog`, `Accordion`, `Tabs`, `RadioGroup`, etc.) as building blocks for designers.

4. **Implement page builder editor** — Build visual editor in `/apps/web/src/features/section-editor/` allowing users to select templates, click sections, and edit content (text, images, links) in real-time with live preview.

5. **Develop AI component spec generator** — Create backend service in `/apps/api/src/services/ai.service.ts` that generates JSON component specifications following the defined schema (props, slots, accessibility, Radix primitives). Store specs in `/packages/ai-specs/specs/`.

6. **Build customization management page** — Implement `/apps/web/src/pages/CustomizationManager.tsx` to list, view, edit, and restore all user-customized sections and pages with version history.

### Further Considerations

1. **Database choice?** PostgreSQL for relational data (users, pages, templates) vs MongoDB for flexible customization documents — or hybrid approach?

2. **Authentication strategy?** JWT-based auth with refresh tokens / OAuth providers (Google, GitHub) / Magic link passwordless?

3. **AI Provider?** OpenAI API for component spec generation vs Anthropic Claude API — affects prompt structure and cost model.
