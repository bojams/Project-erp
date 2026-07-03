import { Box, Button, Card, Flex, Grid, Heading, Text, VStack, EmptyState } from '@chakra-ui/react'
import { Users, Plus, UserPlus, Star } from 'lucide-react'
import { motion } from 'motion/react'

const summaryCards = [
  { label: 'Total Pelanggan', value: '0', icon: Users, palette: 'green' },
  { label: 'Pelanggan Baru', value: '0', icon: UserPlus, palette: 'blue' },
  { label: 'Pelanggan Aktif', value: '0', icon: Star, palette: 'orange' },
]

export function CustomersPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
    <VStack gap="6" align="stretch">
      <Flex align="center" justify="space-between" wrap="wrap" gap="4">
        <Flex align="center" gap="3">
          <Flex w="10" h="10" align="center" justify="center" rounded="xl" bg="green.subtle" color="green.fg">
            <Users size={20} />
          </Flex>
          <Box>
            <Heading size="lg" fontWeight="bold" letterSpacing="tight">Pelanggan</Heading>
            <Text color="fg.muted" fontSize="sm">Kelola data pelanggan</Text>
          </Box>
        </Flex>
        <Button>
          <Plus size={16} />
          Tambah Pelanggan
        </Button>
      </Flex>

      <Grid gap="4" templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}>
        {summaryCards.map((item) => {
          const Icon = item.icon
          return (
            <Card.Root key={item.label} variant="elevated" colorPalette={item.palette}>
              <Card.Body p={{ base: '3', md: '4' }}>
                <Flex align="flex-start" justify="space-between" gap="3">
                  <Box minW="0" flex="1">
                    <Text textTransform="uppercase" fontSize="xs" fontWeight="semibold" letterSpacing="wide" color="fg.muted">
                      {item.label}
                    </Text>
                    <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold" color="fg" mt="1.5">
                      {item.value}
                    </Text>
                  </Box>
                  <Flex w="10" h="10" align="center" justify="center" rounded="xl" bg="colorPalette.subtle" color="colorPalette.fg" flexShrink="0">
                    <Icon size={20} />
                  </Flex>
                </Flex>
              </Card.Body>
            </Card.Root>
          )
        })}
      </Grid>

      <Card.Root variant="elevated">
        <Card.Body px={{ base: '4', md: '6' }} py={{ base: '8', md: '12' }}>
          <EmptyState.Root>
            <EmptyState.Content>
              <EmptyState.Indicator>
                <Users size={48} />
              </EmptyState.Indicator>
              <EmptyState.Title>Belum ada pelanggan</EmptyState.Title>
              <EmptyState.Description>
                Data pelanggan akan muncul di sini
              </EmptyState.Description>
              <Button mt="4" size="sm">
                <Plus size={16} />
                Tambah Pelanggan
              </Button>
            </EmptyState.Content>
          </EmptyState.Root>
        </Card.Body>
      </Card.Root>
    </VStack>
    </motion.div>
  )
}
