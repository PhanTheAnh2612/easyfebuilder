/**
 * Component Spec Types
 * Defines the structure for AI-generated component specifications
 */

export interface ComponentSpec {
  id: string;
  componentName: string;
  category: ComponentCategory;
  purpose: string;
  radixPrimitives: string[];
  props: PropSpec[];
  slots: SlotSpec[];
  states: ComponentState[];
  responsiveBehavior: string;
  accessibility: AccessibilitySpec;
  contentConstraints: string[];
  nonGoals: string[];
  exampleUseCase: string;
  createdAt: string;
  updatedAt?: string;
}

export type ComponentCategory = 'section' | 'layout' | 'content' | 'interaction';

export type ComponentState = 'default' | 'hover' | 'focus' | 'active' | 'disabled' | 'loading' | 'error' | 'mobile' | 'tablet' | 'desktop';

export interface PropSpec {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: string;
}

export interface SlotSpec {
  name: string;
  description: string;
  required?: boolean;
}

export interface AccessibilitySpec {
  ariaRoles: string[];
  keyboardNavigation: string;
  screenReaderNotes: string;
  wcagLevel?: 'A' | 'AA' | 'AAA';
}

/**
 * Input for generating a new component spec via AI
 */
export interface ComponentSpecInput {
  componentPurpose: string;
  targetUsers: string;
  contentRequirements: string;
  responsiveNeeds: string;
  interactionNeeds: string;
}
