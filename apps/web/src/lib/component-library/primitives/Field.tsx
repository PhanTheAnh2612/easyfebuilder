"use client"

import * as React from "react"
import { useMemo } from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../utils/cn"
import { Separator } from "./Separator"

// ============================================================================
// FieldSet
// ============================================================================

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-6",
        "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className
      )}
      {...props}
    />
  )
}

// ============================================================================
// FieldLegend
// ============================================================================

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-3 font-medium",
        "data-[variant=legend]:text-base",
        "data-[variant=label]:text-sm",
        className
      )}
      {...props}
    />
  )
}

// ============================================================================
// FieldGroup
// ============================================================================

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-6",
        "data-[slot=checkbox-group]:gap-3",
        "[&>[data-slot=field-group]]:gap-4",
        className
      )}
      {...props}
    />
  )
}

// ============================================================================
// Field
// ============================================================================

const fieldVariants = cva(
  "group/field flex w-full gap-3 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
        horizontal: [
          "flex-row items-center",
          "[&>[data-slot=field-label]]:flex-auto",
          "[&>[data-slot=field-content]]:flex-auto",
          "[&>[data-slot=field-label]]:w-auto",
          "[&>[data-slot=field-content]]:w-auto",
        ],
        responsive: [
          "flex-col @sm/field-group:flex-row @sm/field-group:items-start",
          "[&>*]:w-full @sm/field-group:[&>*]:w-auto",
          "@sm/field-group:[&>[data-slot=field-label]]:flex-auto",
          "@sm/field-group:[&>[data-slot=field-content]]:flex-auto",
        ],
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
)

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

// ============================================================================
// FieldContent
// ============================================================================

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex flex-1 flex-col gap-1 leading-snug",
        className
      )}
      {...props}
    />
  )
}

// ============================================================================
// FieldLabel
// ============================================================================

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="field-label"
      className={cn(
        "group/field-label peer/field-label flex w-fit leading-snug text-sm font-medium",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
        className
      )}
      {...props}
    />
  )
}

// ============================================================================
// FieldTitle
// ============================================================================

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-title"
      className={cn(
        "flex w-fit items-center gap-2 text-sm leading-snug font-medium",
        "group-data-[disabled=true]/field:opacity-50",
        className
      )}
      {...props}
    />
  )
}

// ============================================================================
// FieldDescription
// ============================================================================

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-muted-foreground text-left text-sm leading-normal font-normal",
        "group-has-[[data-orientation=horizontal]]/field:text-balance",
        "[[data-variant=legend]+&]:-mt-1.5",
        "last:mt-0 nth-last-2:-mt-1",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      {...props}
    />
  )
}

// ============================================================================
// FieldSeparator
// ============================================================================

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode
}) {
  if (children) {
    return (
      <div
        data-slot="field-separator"
        className={cn(
          "flex items-center gap-3 text-xs text-muted-foreground",
          className
        )}
        {...props}
      >
        <Separator className="flex-1" />
        <span>{children}</span>
        <Separator className="flex-1" />
      </div>
    )
  }

  return <Separator data-slot="field-separator" className={className} {...props} />
}

// ============================================================================
// FieldError
// ============================================================================

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const errorMessages = useMemo(() => {
    if (!errors) return []
    return errors
      .filter((error): error is { message: string } => !!error?.message)
      .map((error) => error.message)
  }, [errors])

  if (!children && errorMessages.length === 0) {
    return null
  }

  return (
    <div
      data-slot="field-error"
      role="alert"
      aria-live="polite"
      className={cn(
        "text-destructive text-sm font-medium",
        className
      )}
      {...props}
    >
      {children}
      {errorMessages.length === 1 && !children && errorMessages[0]}
      {errorMessages.length > 1 && !children && (
        <ul className="list-disc list-inside space-y-1">
          {errorMessages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
  fieldVariants,
}
