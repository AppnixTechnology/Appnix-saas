"use client"

import * as React from "react"
import * as Slot from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const separatorVariants = cva("shrink-0 bg-border")

const Separator = React.forwardRef<
  React.ElementRef<typeof Slot.Slot>,
  React.ComponentPropsWithoutRef<typeof Slot.Slot> & VariantProps<typeof separatorVariants>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <Slot.Slot
    ref={ref}
    role={decorative ? "none" : "separator"}
    aria-orientation={decorative ? undefined : orientation}
    className={cn(separatorVariants({ orientation }), className)}
    {...props}
  />
))
Separator.displayName = "Separator"

export { Separator }