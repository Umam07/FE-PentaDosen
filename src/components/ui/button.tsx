import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-ink text-on-ink shadow-sm hover:bg-ink-hover active:bg-ink-active",
        hero: "bg-accent text-on-ink shadow-sm hover:bg-accent-hover active:bg-accent-active",
        destructive:
          "bg-error text-white shadow-sm hover:bg-error/90 dark:bg-error-on-dark dark:text-zinc-950",
        outline:
          "border border-hairline-light bg-surface-light text-ink-heading shadow-sm hover:bg-surface-light-raised dark:border-hairline-dark dark:bg-surface-dark-elevated dark:text-on-dark dark:hover:bg-surface-dark",
        secondary:
          "border border-hairline-light bg-surface-light text-ink-heading shadow-sm hover:bg-surface-light-raised dark:border-hairline-dark dark:bg-surface-dark-elevated dark:text-on-dark",
        ghost: "text-muted hover:bg-ink-soft hover:text-ink-heading dark:hover:bg-surface-dark-elevated dark:hover:text-on-dark",
        link: "text-accent underline-offset-4 hover:underline dark:text-accent-on-dark",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-10 rounded-lg px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
