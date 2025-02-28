import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/utils"

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-[#405189] text-[#FFF] hover:bg-[#2D3960] focus:bg-[#202945] disabled:bg-gray-450',
        secondary:
          'bg-[#34B2AC] text-[#FFF] hover:bg-[#2FA19B] focus:bg-[#278581] disabled:bg-[#B2B3B9]',
        secondary2:
          'bg-[#299CDB] text-[#FFF] hover:bg-[#1D6E9A] focus:bg-[#154E6E] disabled:bg-[#9DA2A5]',
        secondary3:
          'bg-transparent text-brown dark:text-[#FFF] hover:bg-[#FAFAFA] dark:hover:bg-gray-700 focus:bg-[#F2F2F2] dark:focus:bg-gray-600 disabled:bg-[#CDE4DA] border border-gray-350',
        tertiary:
          'bg-[#6B8E23] text-[#FFF] hover:bg-[#556B2F] focus:bg-[#3E4E25] disabled:bg-[#A3B18A]',
        error:
          'bg-error text-error-foreground hover:bg-[#CC563D] focus:bg-[#A84733] disabled:bg-[#9E9E9E]',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 w-20 px-4 py-2',
        sm: 'h-8 w-16 rounded-md px-3',
        lg: 'h-10 w-24 rounded-md px-8',
        full: 'w-full h-9 px-4 py-2',
        icon: 'h-8 w-8 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
