import { useState, useEffect } from 'react'
import { Box, Flex, Text, CloseButton, Portal } from '@chakra-ui/react'
import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastOpts {
  title: string
  description?: string
}

interface Toast extends ToastOpts {
  id: string
  type: ToastType
}

type Listener = (toast: ToastOpts & { type: ToastType }) => void
const listeners = new Set<Listener>()

export const toaster = {
  success: (opts: ToastOpts) => { listeners.forEach((fn) => fn({ ...opts, type: 'success' })) },
  error: (opts: ToastOpts) => { listeners.forEach((fn) => fn({ ...opts, type: 'error' })) },
  warning: (opts: ToastOpts) => { listeners.forEach((fn) => fn({ ...opts, type: 'warning' })) },
  info: (opts: ToastOpts) => { listeners.forEach((fn) => fn({ ...opts, type: 'info' })) },
}

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const accentColor: Record<ToastType, string> = {
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const handler: Listener = (evt) => {
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
      setToasts((prev) => [...prev, { ...evt, id }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 4000)
    }
    listeners.add(handler)
    return () => { listeners.delete(handler) }
  }, [])

  const remove = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  if (toasts.length === 0) return null

  return (
    <Portal>
      <Flex
        position="fixed"
        top="1.5rem"
        right="1.5rem"
        zIndex="toast"
        direction="column"
        gap="2"
        w="full"
        maxW="28rem"
        pointerEvents="none"
      >
        {toasts.map((toast) => {
          const Icon = icons[toast.type]
          return (
            <Flex
              key={toast.id}
              align="flex-start"
              gap="3"
              p="3.5"
              bg="bg.panel"
              borderWidth="1px"
              borderColor="border"
              borderLeftWidth="4px"
              borderLeftColor={accentColor[toast.type]}
              shadow="lg"
              rounded="xl"
              pointerEvents="auto"
              animation="toastUp 0.3s ease-out"
            >
              <Box as={Icon} boxSize="4.5" flexShrink={0} mt="0.5" color={accentColor[toast.type]} />
              <Box flex="1" minW="0">
                <Text fontWeight="semibold" fontSize="sm" color="fg" lineHeight="1.4">
                  {toast.title}
                </Text>
                {toast.description && (
                  <Text fontSize="xs" color="fg.muted" mt="0.5" lineHeight="1.4">
                    {toast.description}
                  </Text>
                )}
              </Box>
              <CloseButton
                size="xs"
                color="fg.subtle"
                _hover={{ bg: 'bg.subtle' }}
                onClick={() => remove(toast.id)}
              />
            </Flex>
          )
        })}
      </Flex>
    </Portal>
  )
}
