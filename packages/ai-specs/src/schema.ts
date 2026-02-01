import { z } from 'zod';

/**
 * Zod schema for validating AI-generated component specifications
 */

export const propSpecSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  required: z.boolean(),
  description: z.string().min(1),
  defaultValue: z.string().optional(),
});

export const slotSpecSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  required: z.boolean().optional(),
});

export const accessibilitySpecSchema = z.object({
  ariaRoles: z.array(z.string()),
  keyboardNavigation: z.string(),
  screenReaderNotes: z.string(),
  wcagLevel: z.enum(['A', 'AA', 'AAA']).optional(),
});

export const componentCategorySchema = z.enum([
  'section',
  'layout',
  'content',
  'interaction',
]);

export const componentStateSchema = z.enum([
  'default',
  'hover',
  'focus',
  'active',
  'disabled',
  'loading',
  'error',
  'mobile',
  'tablet',
  'desktop',
]);

export const componentSpecSchema = z.object({
  id: z.string().optional(),
  componentName: z.string().min(1).regex(/^[A-Z][a-zA-Z0-9]*$/, {
    message: 'Component name must be PascalCase',
  }),
  category: componentCategorySchema,
  purpose: z.string().min(10),
  radixPrimitives: z.array(z.string()),
  props: z.array(propSpecSchema),
  slots: z.array(slotSpecSchema),
  states: z.array(componentStateSchema),
  responsiveBehavior: z.string(),
  accessibility: accessibilitySpecSchema,
  contentConstraints: z.array(z.string()),
  nonGoals: z.array(z.string()),
  exampleUseCase: z.string().min(10),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type ComponentSpec = z.infer<typeof componentSpecSchema>;
export type PropSpec = z.infer<typeof propSpecSchema>;
export type SlotSpec = z.infer<typeof slotSpecSchema>;
export type AccessibilitySpec = z.infer<typeof accessibilitySpecSchema>;
export type ComponentCategory = z.infer<typeof componentCategorySchema>;
export type ComponentState = z.infer<typeof componentStateSchema>;

/**
 * Validate a component specification
 * @returns true if valid, throws ZodError if invalid
 */
export function validateSpec(spec: unknown): spec is ComponentSpec {
  componentSpecSchema.parse(spec);
  return true;
}

/**
 * Safely validate a component specification
 * @returns Result object with success status and data/error
 */
export function safeValidateSpec(spec: unknown) {
  return componentSpecSchema.safeParse(spec);
}
