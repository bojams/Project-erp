import { Box, Flex, Text } from '@chakra-ui/react'
import { PackageOpen } from 'lucide-react'
import { motion } from 'motion/react'

export function LoadingScreen() {
  return (
    <Flex minH="100dvh" align="center" justify="center" bg="bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <Flex direction="column" align="center" gap="5">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Flex
              w="16"
              h="16"
              align="center"
              justify="center"
              rounded="2xl"
              bg="linear-gradient(135deg, var(--chakra-colors-color-palette-600), var(--chakra-colors-purple-600))"
              shadow="lg"
              color="white"
            >
              <PackageOpen size={32} />
            </Flex>
          </motion.div>

          <Box textAlign="center">
            <Text fontSize="xl" fontWeight="bold" letterSpacing="tight" color="fg">
              Hideo ERP
            </Text>
            <Text fontSize="xs" color="fg.muted" mt="1">
              Memuat...
            </Text>
          </Box>

          <Flex gap="1.5" mt="1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
              >
                <Box w="1.5" h="1.5" rounded="full" bg="colorPalette.600" />
              </motion.div>
            ))}
          </Flex>
        </Flex>
      </motion.div>
    </Flex>
  )
}
