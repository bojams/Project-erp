import { type ReactNode } from 'react'
import { Card as ChakraCard } from '@chakra-ui/react'

export function Card({ children, className, ...props }: { children: ReactNode; className?: string; [key: string]: unknown }) {
  return (
    <ChakraCard.Root variant="elevated" {...props}>
      {children}
    </ChakraCard.Root>
  )
}

export function CardHeader({ children, ...props }: { children: ReactNode; [key: string]: unknown }) {
  return <ChakraCard.Header {...props}>{children}</ChakraCard.Header>
}

export function CardContent({ children, ...props }: { children: ReactNode; [key: string]: unknown }) {
  return <ChakraCard.Body {...props}>{children}</ChakraCard.Body>
}

export function CardFooter({ children, ...props }: { children: ReactNode; [key: string]: unknown }) {
  return <ChakraCard.Footer {...props}>{children}</ChakraCard.Footer>
}

export function CardTitle({ children, ...props }: { children: ReactNode; [key: string]: unknown }) {
  return <ChakraCard.Title {...props}>{children}</ChakraCard.Title>
}

export function CardDescription({ children, ...props }: { children: ReactNode; [key: string]: unknown }) {
  return <ChakraCard.Description {...props}>{children}</ChakraCard.Description>
}
