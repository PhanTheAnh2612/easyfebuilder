# ezfebuilder

Landing page builder platform for small businesses.

## Tech Stack

- **Frontend**: React + Vite + TypeScript + Radix UI + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Monorepo**: pnpm workspaces + Turborepo

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0

### Installation

```bash
pnpm install
```

### Development

```bash
# Run all apps in development mode
pnpm dev

# Run only the web app
pnpm dev:web

# Run only the API
pnpm dev:api
```

### Build

```bash
pnpm build
```

## Project Structure

```
ezfebuilder/
├── apps/
│   ├── web/                # React frontend
│   └── api/                # Node.js backend
├── packages/
│   ├── shared/             # Shared types and utilities
│   ├── component-library/  # Radix UI component primitives
│   └── ai-specs/           # AI-generated component specifications
└── docs/                   # Documentation
```

## Features

1. **Template Selection** - Choose from pre-built landing page templates
2. **Content Editing** - Customize text, images, and sections
3. **AI Component Generation** - Generate custom components using AI
4. **Customization Management** - Manage all user customizations
