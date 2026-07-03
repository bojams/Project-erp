import { forwardRef, type ReactNode } from 'react'
import { Button as ChakraButton } from '@chakra-ui/react'

interface CustomButtonProps {
  isLoading?: boolean
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  form?: string
}

const variantMap: Record<string, string> = {
  primary: 'solid',
  secondary: 'subtle',
  outline: 'outline',
  ghost: 'ghost',
  danger: 'solid',
}

const colorMap: Record<string, string> = {
  danger: 'red',
}

export const Button = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ isLoading, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <ChakraButton
        ref={ref}
        variant={variantMap[variant] as 'solid' | 'subtle' | 'outline' | 'ghost'}
        colorPalette={colorMap[variant] || 'colorPalette'}
        size={size as 'sm' | 'md' | 'lg'}
        loading={isLoading}
        {...props}
      >
        {children}
      </ChakraButton>
    )
  },
)

Button.displayName = 'Button'
