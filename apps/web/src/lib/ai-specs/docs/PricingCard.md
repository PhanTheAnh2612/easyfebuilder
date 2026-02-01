# PricingCard Component

## Overview

Display a single pricing tier with features, price, and call-to-action button for landing page pricing sections.

## Category

`content`

## Radix UI Primitives

- `Card` - Container structure
- `Button` - CTA interaction
- `Slot` - Custom content injection

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `tierName` | `string` | ✅ | - | The name of the pricing tier |
| `price` | `string` | ✅ | - | Formatted price string |
| `description` | `string` | ❌ | - | Brief tier description |
| `features` | `string[]` | ✅ | - | List of included features |
| `ctaText` | `string` | ✅ | - | CTA button text |
| `ctaHref` | `string` | ✅ | - | CTA button URL |
| `highlighted` | `boolean` | ❌ | `false` | Visual emphasis flag |
| `badge` | `string` | ❌ | - | Optional badge text |

## Slots

- **header** - Custom content above tier name
- **footer** - Custom content below CTA
- **featureIcon** - Custom icon for features

## States

- `default` - Normal display
- `hover` - Mouse hover on card/CTA
- `focus` - Keyboard focus on CTA
- `disabled` - Unavailable tier
- `mobile` - Mobile viewport

## Responsive Behavior

- Full width on mobile (<640px)
- Fixed width in grid on tablet/desktop
- Vertical stacking in mobile viewport

## Accessibility

- **ARIA Roles**: `article`, `button`
- **Keyboard**: Tab to CTA, Enter/Space to activate
- **Screen Reader**: Announces tier name, price, feature count

## Content Constraints

1. Tier name: max 20 characters
2. Price: include currency + billing period
3. Description: max 100 characters
4. Features: 3-10 items
5. CTA text: max 25 characters, action-oriented

## Non-Goals

- ❌ Payment processing
- ❌ Subscription state management
- ❌ Cross-tier feature comparison
- ❌ Animations/transitions

## Example Use Case

A SaaS landing page with three pricing tiers (Starter, Pro, Enterprise), Pro tier highlighted as recommended.

---

## Implementation Notes

```typescript
// Suggested component structure
interface PricingCardProps {
  tierName: string;
  price: string;
  description?: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  highlighted?: boolean;
  badge?: string;
  slots?: {
    header?: React.ReactNode;
    footer?: React.ReactNode;
    featureIcon?: React.ReactNode;
  };
}
```
