import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-primary/10 text-primary',
        secondary: 'bg-secondary/10 text-secondary',
        gray: 'bg-gray-100 text-gray-700',
        white: 'bg-white text-gray-700 shadow-sm border border-gray-200',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs rounded-md',
        md: 'px-3 py-1 text-sm rounded-lg',
        lg: 'px-4 py-2 text-base rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'gray',
      size: 'sm',
    },
  }
)

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode
  className?: string
}

const Badge = ({ children, variant, size, className }: BadgeProps) => {
  return (
    <span className={badgeVariants({ variant, size, className })}>
      {children}
    </span>
  )
}

export default Badge