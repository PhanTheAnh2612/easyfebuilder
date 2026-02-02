import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

export const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: '',
      h2: '',
      h3: '',
      h4: '',
      h5: '',
      h6: '',
      paragraph:
        '',
      'paragraph-bold': 'font-bold',
    },
    size: {
      default: '',
    },
  },
  defaultVariants: {
    variant: 'paragraph',
    size: 'default',
  },
});

interface TypographyProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  asChild?: boolean;
  ref?: React.Ref<HTMLElement>;
  as?: React.ElementType;
}

export const Typography = ({
  className,
  variant,
  size = 'default',
  asChild = false,
  ref,
  as,
  ...props
}: TypographyProps) => {
  if (!variant && !as) {
    throw new Error(
      'Typography component requires either a variant or an as prop.'
    );
  }

  const asMapHtmlElement = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    paragraph: 'p',
    'paragraph-bold': 'p',
    label: 'label',
    'sub-label': 'span',
    caption: 'span',
  } as const;

  const asComponent =
    as ||
    (variant
      ? (asMapHtmlElement[variant as keyof typeof asMapHtmlElement] as string)
      : undefined) ||
    'div';

  const Comp = asChild ? Slot : asComponent;

  return (
    <Comp
      ref={ref}
      data-slot="typography"
      className={typographyVariants({ variant, size, className })}
      {...props}
    />
  );
};

Typography.displayName = 'Typography';