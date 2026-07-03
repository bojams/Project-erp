import { Box, Flex, Center, Text, VStack, Heading } from '@chakra-ui/react'
import { Outlet } from 'react-router'
import { PackageOpen } from 'lucide-react'
import { motion } from 'motion/react'

const orbs: {
  size: number
  top?: string
  bottom?: string
  left?: string
  right?: string
  bg: string
  x: number[]
  y: number[]
  duration: number
}[] = [
  {
    size: 420,
    top: '-8%',
    left: '-10%',
    bg: 'rgba(99,102,241,0.10)',
    x: [0, 90, 0, -70, 0],
    y: [0, -70, -110, -30, 0],
    duration: 22,
  },
  {
    size: 340,
    top: '12%',
    right: '-6%',
    bg: 'rgba(168,85,247,0.10)',
    x: [0, -80, 0, 60, 0],
    y: [0, 90, 0, -50, 0],
    duration: 18,
  },
  {
    size: 380,
    bottom: '8%',
    left: '8%',
    bg: 'rgba(20,184,166,0.10)',
    x: [0, 70, 0, -90, 0],
    y: [0, -50, 90, 0, 0],
    duration: 20,
  },
  {
    size: 300,
    bottom: '2%',
    right: '4%',
    bg: 'rgba(236,72,153,0.10)',
    x: [0, -60, 0, 80, 0],
    y: [0, -70, -40, 0, 0],
    duration: 16,
  },
  {
    size: 220,
    top: '35%',
    left: '30%',
    bg: 'rgba(59,130,246,0.08)',
    x: [0, 50, 0, -40, 0],
    y: [0, -40, 70, 0, 0],
    duration: 14,
  },
]

export function AuthLayout() {
  return (
    <Center minH="100dvh" bg="bg" px="4" py="12" position="relative" overflow="hidden">
      {orbs.map((orb) => (
        <motion.div
          key={`${orb.size}-${orb.bg}`}
          style={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: orb.bg,
            filter: 'blur(100px)',
            willChange: 'transform',
            pointerEvents: 'none',
            ...(orb.top ? { top: orb.top } : {}),
            ...(orb.bottom ? { bottom: orb.bottom } : {}),
            ...(orb.left ? { left: orb.left } : {}),
            ...(orb.right ? { right: orb.right } : {}),
          }}
          animate={{ x: orb.x, y: orb.y }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <Box
        position="absolute"
        inset="0"
        opacity="0.025"
        bgImage="radial-gradient(circle at 25px 25px, currentColor 1px, transparent 0)"
        bgSize="60px 60px"
        pointerEvents="none"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ width: '100%', maxWidth: '28rem', position: 'relative' }}
      >
        <VStack gap="8" w="full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
            style={{ width: '100%' }}
          >
            <VStack gap="4" textAlign="center">
              <Flex
                w="14"
                h="14"
                align="center"
                justify="center"
                rounded="2xl"
                bg="linear-gradient(135deg, var(--chakra-colors-color-palette-600), var(--chakra-colors-purple-600))"
                shadow="lg"
                color="white"
              >
                <PackageOpen size={28} />
              </Flex>
              <Box>
                <Heading size="2xl" fontWeight="bold" letterSpacing="tight" color="fg">
                  Hideo ERP
                </Heading>
                <Text color="fg.muted" mt="1" fontSize="sm">
                  Modern ERP untuk UMKM Indonesia
                </Text>
              </Box>
            </VStack>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: 0.18 }}
            style={{ width: '100%' }}
          >
            <Outlet />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Text color="fg.subtle" fontSize="xs" textAlign="center">
              &copy; {new Date().getFullYear()} Hideo ERP. All rights reserved.
            </Text>
          </motion.div>
        </VStack>
      </motion.div>
    </Center>
  )
}
