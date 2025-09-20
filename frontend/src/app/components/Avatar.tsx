import Image from 'next/image'
import { cva, type VariantProps } from 'class-variance-authority'

const avatarVariants = cva(
  'relative overflow-hidden bg-gray-100 flex items-center justify-center',
  {
    variants: {
      size: {
        sm: 'w-8 h-8 rounded-md',
        md: 'w-12 h-12 rounded-lg',
        lg: 'w-16 h-16 rounded-xl',
        xl: 'w-24 h-24 rounded-2xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

interface AvatarProps extends VariantProps<typeof avatarVariants> {
  src?: string
  alt: string
  className?: string
}

const Avatar = ({ src, alt, size, className }: AvatarProps) => {
  return (
    <div className={avatarVariants({ size, className })}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  )
}

export default Avatar