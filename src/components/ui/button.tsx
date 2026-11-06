import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "press inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-bold disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground link-underline",
        destructive: "bg-destructive text-destructive-foreground link-underline",
        outline: "border-2 border-foreground bg-transparent text-foreground link-underline",
        secondary: "bg-secondary text-secondary-foreground link-underline",
        ghost: "text-foreground link-underline",
        link: "text-primary-text underline-offset-4 hover:underline",
        hero: "bg-primary text-primary-foreground link-underline",
        warm: "bg-warm text-warm-ink link-underline",
        nav: "text-inherit font-medium link-underline",
      },
      size: {
        default: "h-12 px-4",
        sm: "h-11 px-4",
        lg: "h-12 px-6",
        icon: "h-12 w-12",
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
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
