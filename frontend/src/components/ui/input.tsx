import { forwardRef, type InputHTMLAttributes } from 'react'
import { Input as ChakraInput, Field, Stack, IconButton } from '@chakra-ui/react'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    const content = (
      <ChakraInput ref={ref} {...props as Record<string, unknown>} />
    )

    if (!label) return content

    return (
      <Field.Root invalid={!!error}>
        <Field.Label>{label}</Field.Label>
        {content}
        <Field.ErrorText>{error}</Field.ErrorText>
      </Field.Root>
    )
  },
)

Input.displayName = 'Input'

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    const [show, setShow] = useState(false)

    const content = (
      <Stack position="relative">
        <ChakraInput
          ref={ref}
          type={show ? 'text' : 'password'}
          {...props as Record<string, unknown>}
        />
        <IconButton
          aria-label="Toggle password"
          variant="ghost"
          size="xs"
          position="absolute"
          right="2"
          top="50%"
          transform="translateY(-50%)"
          onClick={() => setShow(!show)}
          color="fg.subtle"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </IconButton>
      </Stack>
    )

    if (!label) return content

    return (
      <Field.Root invalid={!!error}>
        <Field.Label>{label}</Field.Label>
        {content}
        <Field.ErrorText>{error}</Field.ErrorText>
      </Field.Root>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'
