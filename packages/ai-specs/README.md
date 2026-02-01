# AI Component Specifications

This package contains AI-generated component specifications for the ezfebuilder platform.

## Structure

```
ai-specs/
├── specs/              # JSON specification files
│   └── *.spec.json
├── docs/               # Human-readable documentation
│   └── *.md
└── src/                # TypeScript utilities
    ├── schema.ts       # Zod validation schema
    └── index.ts        # Exports
```

## Spec Format

Each specification follows this JSON schema:

```json
{
  "componentName": "string",
  "category": "section | layout | content | interaction",
  "purpose": "string",
  "radixPrimitives": ["string"],
  "props": [...],
  "slots": [...],
  "states": ["default", "hover", "focus", "disabled", "mobile"],
  "responsiveBehavior": "string",
  "accessibility": {
    "ariaRoles": ["string"],
    "keyboardNavigation": "string",
    "screenReaderNotes": "string"
  },
  "contentConstraints": ["string"],
  "nonGoals": ["string"],
  "exampleUseCase": "string"
}
```

## Usage

### Validating Specs

```bash
pnpm validate
```

### Importing in Code

```typescript
import { componentSpecSchema, validateSpec } from '@ezfebuilder/ai-specs';

const isValid = validateSpec(mySpec);
```

## Workflow

1. BA writes feature intent
2. Feed intent into Claude/GPT using the safe prompt
3. Store JSON spec in `/specs`
4. Dev implements component from spec
5. Component documented in Storybook
