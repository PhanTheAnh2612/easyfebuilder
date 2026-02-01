# FeatureShowcase Component

## Overview

Display a product feature with image, title, description and optional call-to-action in an alternating layout pattern.

## Category

`section`

## Radix UI Primitives

- `Slot` - Custom content injection
- `AspectRatio` - Consistent image sizing

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | ✅ | - | Feature title/heading |
| `description` | `string` | ✅ | - | Detailed feature description |
| `image` | `{ src: string; alt: string }` | ✅ | - | Feature image with alt |
| `imagePosition` | `'left' \| 'right'` | ❌ | `'left'` | Image position relative to content |
| `ctaText` | `string` | ❌ | - | Optional CTA button text |
| `ctaHref` | `string` | ❌ | - | Optional CTA button URL |
| `bullets` | `string[]` | ❌ | - | Key points/sub-features |

## Slots

- **icon** - Icon above title
- **media** - Replace default image with custom media

## States

- `default` - Normal display
- `hover` - Mouse hover state
- `mobile` - <640px viewport
- `tablet` - 640-1024px viewport
- `desktop` - >1024px viewport

## Responsive Behavior

- **Desktop**: Two-column, image 50% width, side-by-side
- **Mobile**: Single column, image stacked on top, 100% width

## Accessibility

- **ARIA Roles**: `region`, `img`
- **Keyboard**: Tab to CTA if present
- **Screen Reader**: Proper heading hierarchy, image alt text describes feature

## Content Constraints

1. Title: 3-8 words (max 60 characters)
2. Description: 2-4 sentences (max 300 characters)
3. Image: 16:9 or 4:3 aspect ratio
4. Bullets: 2-5 items, each max 50 characters

## Non-Goals

- ❌ Video content support
- ❌ Parallax/scroll animations
- ❌ Feature carousel/slideshow

## Example Use Case

Showcasing "Real-time Collaboration" feature with screenshot, description, and "Learn More" button.

---

## Implementation Notes

```typescript
interface FeatureShowcaseProps {
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  imagePosition?: 'left' | 'right';
  ctaText?: string;
  ctaHref?: string;
  bullets?: string[];
  slots?: {
    icon?: React.ReactNode;
    media?: React.ReactNode;
  };
}
```
