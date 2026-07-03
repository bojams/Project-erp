import { Box, Card, Flex, Grid, Heading, Text } from '@chakra-ui/react'
import { BarChart3, ShoppingCart, Truck, Package, DollarSign, TrendingDown, Users, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'

const reports = [
  { label: 'Penjualan', desc: 'Laporan penjualan harian, bulanan, tahunan', icon: ShoppingCart, palette: 'blue' },
  { label: 'Pembelian', desc: 'Riwayat pembelian dari supplier', icon: Truck, palette: 'teal' },
  { label: 'Stok', desc: 'Mutasi stok dan nilai inventaris', icon: Package, palette: 'orange' },
  { label: 'Keuangan', desc: 'Arus kas dan ringkasan keuangan', icon: DollarSign, palette: 'green' },
  { label: 'Labirugi', desc: 'Laporan laba rugi periode tertentu', icon: TrendingDown, palette: 'red' },
  { label: 'Pelanggan', desc: 'Data dan aktivitas pelanggan', icon: Users, palette: 'purple' },
]

export function ReportsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
    <Box>
      <Flex align="center" gap="3" mb="1">
        <Flex w="10" h="10" align="center" justify="center" rounded="xl" bg="colorPalette.subtle" color="colorPalette.fg">
          <BarChart3 size={20} />
        </Flex>
        <Box>
          <Heading size="lg" fontWeight="bold" letterSpacing="tight">Laporan</Heading>
          <Text color="fg.muted" fontSize="sm">Lihat laporan bisnis Anda</Text>
        </Box>
      </Flex>
      <Grid mt="6" gap="4" templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}>
        {reports.map((report) => {
          const Icon = report.icon
          return (
            <Card.Root
              key={report.label}
              variant="elevated"
              colorPalette={report.palette}
              cursor="pointer"
              transition="all 0.15s"
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
            >
              <Card.Body p="5">
                <Flex align="flex-start" gap="4">
                  <Flex w="11" h="11" align="center" justify="center" rounded="xl" bg="colorPalette.subtle" color="colorPalette.fg" flexShrink="0">
                    <Icon size={22} />
                  </Flex>
                  <Box flex="1" minW="0">
                    <Text fontWeight="semibold" color="fg">{report.label}</Text>
                    <Text fontSize="xs" color="fg.muted" mt="0.5">{report.desc}</Text>
                  </Box>
                  <Box as={ArrowRight} boxSize="4" mt="1.5" color="fg.subtle" flexShrink="0" />
                </Flex>
              </Card.Body>
            </Card.Root>
          )
        })}
      </Grid>
    </Box>
    </motion.div>
  )
}
