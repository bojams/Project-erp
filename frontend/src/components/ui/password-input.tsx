import { Box, IconButton, Input, type InputProps } from '@chakra-ui/react'
import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const [show, setShow] = useState(false)

  return (
    <Box position="relative" w="full">
      <Input
        ref={ref}
        type={show ? 'text' : 'password'}
        pr="2.5rem"
        {...props}
      />
      <IconButton
        position="absolute"
        right="0.5rem"
        top="50%"
        transform="translateY(-50%)"
        variant="ghost"
        size="2xs"
        color="fg.muted"
        _hover={{ color: 'fg' }}
        aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
        onClick={() => setShow((prev) => !prev)}
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </IconButton>
    </Box>
  )
})

PasswordInput.displayName = 'PasswordInput'
