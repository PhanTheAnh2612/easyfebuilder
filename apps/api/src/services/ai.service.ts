import OpenAI from 'openai';
import { randomUUID } from 'crypto';
import { createError } from '../middleware/errorHandler.js';

interface ComponentSpecInput {
  componentPurpose: string;
  targetUsers: string;
  contentRequirements: string;
  responsiveNeeds: string;
  interactionNeeds: string;
}

interface ComponentSpec {
  id: string;
  componentName: string;
  category: 'section' | 'layout' | 'content' | 'interaction';
  purpose: string;
  radixPrimitives: string[];
  props: PropSpec[];
  slots: SlotSpec[];
  states: string[];
  responsiveBehavior: string;
  accessibility: AccessibilitySpec;
  contentConstraints: string[];
  nonGoals: string[];
  exampleUseCase: string;
  createdAt: string;
}

interface PropSpec {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface SlotSpec {
  name: string;
  description: string;
}

interface AccessibilitySpec {
  ariaRoles: string[];
  keyboardNavigation: string;
  screenReaderNotes: string;
}

// Mock stored specs
const mockSpecs: ComponentSpec[] = [];

const AI_SYSTEM_PROMPT = `You are a senior UI system designer and accessibility-focused frontend architect.
You do NOT write production code.
You ONLY produce structured, implementation-ready component specifications.

Context:
We are building a landing-page platform for small businesses.
Components must be:
- Headless and unstyled
- Built on Radix UI primitives
- Accessible (WCAG AA)
- Reusable and documented
- Implementable later by developers

Hard constraints (must follow):
- Do NOT output JSX, TSX, or executable code
- Do NOT reference internal business logic
- Do NOT assume styling frameworks
- Do NOT invent APIs outside provided schema
- Output must be valid JSON only

Output schema:
{
  "componentName": "string",
  "category": "section | layout | content | interaction",
  "purpose": "string",
  "radixPrimitives": ["string"],
  "props": [
    {
      "name": "string",
      "type": "string",
      "required": true,
      "description": "string"
    }
  ],
  "slots": [
    {
      "name": "string",
      "description": "string"
    }
  ],
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

Response rules:
- Output JSON only
- No markdown
- No explanations
- No code
- No styling details`;

export class AIService {
  private openai: OpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
  }

  async generateComponentSpec(input: ComponentSpecInput): Promise<ComponentSpec> {
    const userPrompt = `Generate a component specification for:

Component purpose: ${input.componentPurpose}
Target users: ${input.targetUsers}
Content requirements: ${input.contentRequirements}
Responsive needs: ${input.responsiveNeeds}
Interaction needs: ${input.interactionNeeds}`;

    if (!this.openai) {
      // Return mock spec when no API key is configured
      const mockSpec = this.generateMockSpec(input);
      mockSpecs.push(mockSpec);
      return mockSpec;
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: AI_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw createError('Failed to generate component spec', 500);
      }

      const parsedSpec = JSON.parse(content);
      const spec: ComponentSpec = {
        id: randomUUID(),
        ...parsedSpec,
        createdAt: new Date().toISOString(),
      };

      mockSpecs.push(spec);
      return spec;
    } catch (error) {
      console.error('AI generation error:', error);
      throw createError('Failed to generate component spec', 500);
    }
  }

  async getAllSpecs(): Promise<ComponentSpec[]> {
    return mockSpecs;
  }

  async getSpecById(id: string): Promise<ComponentSpec> {
    const spec = mockSpecs.find((s) => s.id === id);
    if (!spec) {
      throw createError('Spec not found', 404);
    }
    return spec;
  }

  private generateMockSpec(input: ComponentSpecInput): ComponentSpec {
    const componentName = input.componentPurpose
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join('')
      .replace(/[^a-zA-Z]/g, '');

    return {
      id: randomUUID(),
      componentName: componentName || 'CustomComponent',
      category: 'section',
      purpose: input.componentPurpose,
      radixPrimitives: ['Slot', 'Primitive'],
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          required: false,
          description: 'Content to render inside the component',
        },
        {
          name: 'className',
          type: 'string',
          required: false,
          description: 'Additional CSS classes for styling',
        },
      ],
      slots: [
        {
          name: 'header',
          description: 'Header content slot',
        },
        {
          name: 'content',
          description: 'Main content slot',
        },
      ],
      states: ['default', 'hover', 'focus', 'disabled', 'mobile'],
      responsiveBehavior: input.responsiveNeeds || 'Stack vertically on mobile, horizontal on desktop',
      accessibility: {
        ariaRoles: ['region'],
        keyboardNavigation: 'Tab through interactive elements',
        screenReaderNotes: 'Ensure proper heading hierarchy',
      },
      contentConstraints: [
        'Heading should be concise (max 60 characters)',
        'Description should be readable (max 200 characters)',
      ],
      nonGoals: [
        'Does not handle form submission',
        'Does not manage external state',
      ],
      exampleUseCase: input.componentPurpose,
      createdAt: new Date().toISOString(),
    };
  }
}
