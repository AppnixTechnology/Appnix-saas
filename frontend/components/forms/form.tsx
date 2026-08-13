"use client"

import * as React from "react"
import * as Slot from "@radix-ui/react-slot"
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"

const Form = FormProvider

type FormFieldContextValue<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>
}

const FormFieldContext = React.createContext<FormFieldContextValue<FieldValues> | undefined>(undefined)

const FormField = <TFieldValues extends FieldValues = FieldValues>({
  ...props
}: ControllerProps<TFieldValues>) => {
  return <Controller {...props} />
}

const FormFieldContextValue = <TFieldValues extends FieldValues = FieldValues>({
  name,
}: FormFieldContextValue<TFieldValues>) => {
  return name
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const fieldState = getFieldState(fieldContext.name, formState)

  const { id } = itemContext ?? {}

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue | undefined>(undefined)

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId()
    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn("space-y-2", className)} {...props} />
      </FormItemContext.Provider>
    )
  }
)
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    const { formItemId } = useFormField()
    return (
      <label
        ref={ref}
        className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
        htmlFor={formItemId}
        {...props}
      />
    )
  }
)
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<React.ElementRef<"input">, React.ComponentPropsWithoutRef<typeof Slot.Slot> & { asChild?: boolean }>(
  ({ className, asChild = false, ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
    const Comp = asChild ? Slot.Slot : "input"
    return (
      <Comp
        ref={ref}
        id={formItemId}
        aria-describedby={error ? formMessageId : formDescriptionId}
        aria-invalid={!!error}
        className={cn("", className)}
        {...props}
      />
    )
  }
)
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField()
    return (
      <p ref={ref} id={formDescriptionId} className={cn("text-sm text-muted-foreground", className)} {...props} />
    )
  }
)
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField()
    const body = error ? String(error.message) : children
    if (!body) return null
    return (
      <p ref={ref} id={formMessageId} className={cn("text-sm font-medium text-destructive", className)} {...props}>
        {body}
      </p>
    )
  }
)
FormMessage.displayName = "FormMessage"

export { useFormField, Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage }