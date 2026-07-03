import React from 'react'
import { Box, Card, Flex, Grid, Heading, Text, Spinner, VStack, EmptyState, HStack, Badge, IconButton } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import { dashboardApi } from '@/api/dashboard'
import { Package, TrendingUp, DollarSign, AlertTriangle, PackageOpen, Receipt, Clock, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatRupiah } from '@/utils/format'
import { motion } from 'motion/react'
import type { DashboardData, MonthlyChartPoint } from '@/types/dashboard'

const statCards = [
  { label: 'Total Produk', key: 'total_products' as const, icon: Package, palette: 'purple', format: (v: number) => String(v) },
  { label: 'Penjualan Hari Ini', key: 'today_sales' as const, icon: TrendingUp, palette: 'blue', format: (v: number) => `${v} transaksi` },
  { label: 'Pendapatan Bulan Ini', key: 'this_month_revenue' as const, icon: DollarSign, palette: 'green', format: (v: number) => formatRupiah(v) },
  { label: 'Stok Menipis', key: 'low_stock_count' as const, icon: AlertTriangle, palette: 'red', format: (v: number) => String(v) },
  { label: 'Produk Baru', key: 'new_products_count' as const, icon: PackageOpen, palette: 'orange', format: (v: number) => String(v) },
]

function RevenueChart({ dash, year, onYearChange }: { dash?: DashboardData; year: number; onYearChange: (y: number) => void }) {
  const chartData = dash?.monthly_chart ?? []
  const hasData = chartData.length > 0 && chartData.some((d) => d.revenue > 0 || d.expenses > 0)

  const W = 360
  const H = 120
  const padL = 55
  const padR = 10
  const padT = 12
  const padB = 30
  const chartW = W - padL - padR
  const chartH = H - padT - padB

  const allValues = hasData ? chartData.flatMap((d) => [d.revenue, d.expenses]) : [1]
  const maxVal = Math.max(...allValues, 1)
  const range = maxVal || 1

  const scaleY = (v: number) => padT + chartH - (v / range) * chartH

  function buildLinePath(data: MonthlyChartPoint[], key: 'revenue' | 'expenses') {
    return data
      .map((d, i) => {
        const x = padL + (i / (data.length - 1)) * chartW
        const y = scaleY(d[key])
        return `${i === 0 ? 'M' : 'L'}${x},${y}`
      })
      .join(' ')
  }

  const lastRevenue = hasData ? chartData[chartData.length - 1].revenue : 0
  const lastExpenses = hasData ? chartData[chartData.length - 1].expenses : 0

  function fmt(v: number): string {
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(v >= 10_000_000 ? 0 : 1).replace(/\.0$/, '') + 'jt'
    if (v >= 1_000) return (v / 1_000).toFixed(v >= 10_000 ? 0 : 1).replace(/\.0$/, '') + 'rb'
    return String(Math.round(v))
  }

  const chartBottomPct = ((padT + chartH) / H) * 100
  const monthTopPct = chartBottomPct + 8

  const revenueLine = hasData ? buildLinePath(chartData, 'revenue') : ''
  const expensesLine = hasData ? buildLinePath(chartData, 'expenses') : ''
  const bottomY = scaleY(0)
  const revenueArea = revenueLine ? `${revenueLine} L${padL + chartW},${bottomY} L${padL},${bottomY} Z` : ''
  const expensesArea = expensesLine ? `${expensesLine} L${padL + chartW},${bottomY} L${padL},${bottomY} Z` : ''

  return (
    <Card.Root variant="elevated">
      <Card.Header px={{ base: '3', md: '5' }} pt={{ base: '3', md: '4' }} pb="0">
        <Flex direction={{ base: 'column', sm: 'row' }} align={{ base: 'flex-start', sm: 'center' }} justify="space-between" gap="2">
          <Flex align="center" gap="2">
            <TrendingDown size={15} />
            <Text fontWeight="semibold" fontSize="sm" color="fg">Pendapatan & Pengeluaran</Text>
            <HStack gap="1" ml="2">
              <IconButton
                size="2xs"
                variant="ghost"
                aria-label="Tahun sebelumnya"
                onClick={() => onYearChange(year - 1)}
              >
                <ChevronLeft size={14} />
              </IconButton>
              <Text fontSize="xs" fontWeight="bold" color="fg" minW="10" textAlign="center">{year}</Text>
              <IconButton
                size="2xs"
                variant="ghost"
                aria-label="Tahun berikutnya"
                onClick={() => onYearChange(year + 1)}
              >
                <ChevronRight size={14} />
              </IconButton>
            </HStack>
          </Flex>
          <HStack gap="4" wrap="wrap">
            <HStack gap="1.5">
              <Box w="3" h="3" rounded="full" bg="green.500" />
              <Text fontSize="xs" color="fg.muted">Pemasukan</Text>
              <Text fontSize="xs" fontWeight="bold" color="fg">{formatRupiah(lastRevenue)}</Text>
            </HStack>
            <HStack gap="1.5">
              <Box w="3" h="3" rounded="full" bg="red.500" />
              <Text fontSize="xs" color="fg.muted">Pengeluaran</Text>
              <Text fontSize="xs" fontWeight="bold" color="fg">{formatRupiah(lastExpenses)}</Text>
            </HStack>
          </HStack>
        </Flex>
      </Card.Header>
      <Card.Body px={{ base: '2', md: '4' }} pt="3" pb="3">
        {hasData ? (
          <Box w="full" aspectRatio={W / H} position="relative" overflow="hidden">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              style={{ width: '100%', height: '100%', display: 'block' }}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="revGrad4" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chakra-colors-green-500)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--chakra-colors-green-500)" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="expGrad4" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chakra-colors-red-500)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--chakra-colors-red-500)" stopOpacity="0.01" />
                </linearGradient>
              </defs>
              {[0, 0.5, 1].map((ratio) => {
                const y = scaleY(ratio * range)
                return (
                  <line key={ratio} x1={padL} y1={y} x2={padL + chartW} y2={y} stroke="var(--chakra-colors-border)" strokeWidth="0.5" strokeDasharray="3 2" />
                )
              })}
              <path d={revenueArea} fill="url(#revGrad4)" />
              <path d={revenueLine} fill="none" stroke="var(--chakra-colors-green-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d={expensesArea} fill="url(#expGrad4)" />
              <path d={expensesLine} fill="none" stroke="var(--chakra-colors-red-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              {chartData.map((d, i) => {
                const x = padL + (i / (chartData.length - 1)) * chartW
                const revY = scaleY(d.revenue)
                const expY = scaleY(d.expenses)
                const isLast = i === chartData.length - 1
                return (
                  <g key={i}>
                    <circle cx={x} cy={revY} r={isLast ? 2.5 : 1.5} fill="var(--chakra-colors-green-500)" stroke="white" strokeWidth={isLast ? 1.2 : 0.8} />
                    <circle cx={x} cy={expY} r={isLast ? 2.5 : 1.5} fill="var(--chakra-colors-red-500)" stroke="white" strokeWidth={isLast ? 1.2 : 0.8} />
                  </g>
                )
              })}
            </svg>
            {[0, 0.5, 1].map((ratio) => {
              const val = ratio * range
              const y = scaleY(val)
              return (
                <Text
                  key={ratio}
                  position="absolute"
                  right="87%"
                  top={`${(y / H) * 100}%`}
                  textAlign="right"
                  lineHeight="1"
                  color="fg.subtle"
                  fontSize={{ base: '10px', md: '20px' }}
                  style={{ transform: 'translateY(-50%)', whiteSpace: 'nowrap' }}
                >
                  {fmt(val)}
                </Text>
              )
            })}
            {chartData.map((d, i) => {
              const x = padL + (i / (chartData.length - 1)) * chartW
              return (
                <Text
                  key={i}
                  position="absolute"
                  left={`${(x / W) * 100}%`}
                  top={`${monthTopPct}%`}
                  textAlign="center"
                  lineHeight="1"
                  color="fg.subtle"
                  fontSize={{ base: '10px', md: '20px' }}
                  style={{ transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}
                >
                  {d.month}
                </Text>
              )
            })}
          </Box>
        ) : (
          <Flex direction="column" align="center" justify="center" gap="2" color="fg.muted" textAlign="center" py="10">
            <TrendingDown size={28} />
            <Text fontSize="xs">Belum Ada Data untuk Tahun {year}</Text>
          </Flex>
        )}
      </Card.Body>
    </Card.Root>
  )
}

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = React.useState(currentYear)

  const { data: dash, isLoading, isError } = useQuery({
    queryKey: ['dashboard', selectedYear],
    queryFn: () => dashboardApi.get(selectedYear),
    refetchInterval: 30_000,
  })

  return (
    <VStack gap="6" align="stretch">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <Box
          bg="linear-gradient(135deg, var(--chakra-colors-blue-600), var(--chakra-colors-purple-600))"
          rounded="2xl"
          p={{ base: '6', md: '8' }}
          color="white"
        >
          <Heading size="xl" fontWeight="bold" letterSpacing="tight">
            Selamat Datang, {user?.name}
          </Heading>
          <Text mt="1.5" opacity="0.85" fontSize="sm" maxW="lg" lineHeight="relaxed">
            Pantau kinerja bisnis Anda dalam satu tampilan. Data diperbarui setiap 30 detik.
          </Text>
        </Box>
      </motion.div>

      {isLoading ? (
        <Flex align="center" justify="center" py="20">
          <Spinner color="colorPalette.600" size="lg" />
        </Flex>
      ) : isError ? (
        <Box textAlign="center" py="20">
          <Box as={AlertTriangle} boxSize="10" mx="auto" color="red.500" />
          <Text mt="3" color="fg.error" fontSize="sm" fontWeight="medium">Gagal memuat data dashboard</Text>
          <Text mt="1" color="fg.muted" fontSize="xs">Coba refresh halaman atau periksa koneksi Anda</Text>
        </Box>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.1 }}
        >
          <Grid gap="4" templateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(5, 1fr)' }}>
            {statCards.map((stat) => {
              const StatIcon = stat.icon
              const value = dash ? stat.format(dash.stats[stat.key]) : '0'
              return (
                <Card.Root key={stat.label} variant="elevated" colorPalette={stat.palette}>
                  <Card.Body p={{ base: '3', md: '4' }}>
                    <Flex align="flex-start" justify="space-between" gap="3">
                      <Box minW="0" flex="1">
                        <Text textTransform="uppercase" fontSize="xs" fontWeight="semibold" letterSpacing="wide" color="fg.muted">
                          {stat.label}
                        </Text>
                        <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold" color="fg" mt="1.5" lineHeight="1.2" truncate>
                          {value}
                        </Text>
                      </Box>
                      <Flex
                        w="10"
                        h="10"
                        align="center"
                        justify="center"
                        rounded="xl"
                        bg="colorPalette.subtle"
                        color="colorPalette.fg"
                        flexShrink="0"
                      >
                        <StatIcon size={20} />
                      </Flex>
                    </Flex>
                  </Card.Body>
                </Card.Root>
              )
            })}
          </Grid>

          <Box my={{ base: '4', md: '6' }}>
            <RevenueChart dash={dash} year={selectedYear} onYearChange={setSelectedYear} />
          </Box>

          <Grid gap="6" templateColumns={{ base: '1fr', lg: '1fr 1fr' }}>
            <Card.Root variant="elevated">
              <Card.Header px={{ base: '4', md: '6' }} pt={{ base: '4', md: '5' }} pb="0">
                <Flex align="center" gap="2">
                  <Receipt size={18} />
                  <Text fontWeight="semibold" fontSize="sm" color="fg">Transaksi Terbaru</Text>
                </Flex>
              </Card.Header>
              <Card.Body px={{ base: '4', md: '6' }} pt="4" pb={{ base: '4', md: '5' }}>
                {dash!.recent_transactions.length === 0 ? (
                  <EmptyState.Root>
                    <EmptyState.Content>
                      <EmptyState.Indicator>
                        <Receipt size={40} />
                      </EmptyState.Indicator>
                      <EmptyState.Title>Belum ada transaksi</EmptyState.Title>
                      <EmptyState.Description>
                        Data akan muncul setelah Anda memulai penjualan
                      </EmptyState.Description>
                    </EmptyState.Content>
                  </EmptyState.Root>
                ) : (
                  <VStack gap="2">
                    {dash!.recent_transactions.map((t) => (
                      <Flex
                        key={t.id}
                        align="center"
                        justify="space-between"
                        rounded="lg"
                        borderWidth="1px"
                        borderColor="border"
                        px="4"
                        py="3"
                        transition="all 0.15s"
                        _hover={{ bg: 'bg.subtle', borderColor: 'border' }}
                      >
                        <HStack gap="3" minW="0">
                          <Box
                            w="8"
                            h="8"
                            rounded="lg"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            bg="colorPalette.subtle"
                            color="colorPalette.fg"
                            flexShrink="0"
                          >
                            <Receipt size={14} />
                          </Box>
                          <Box minW="0">
                            <Text fontWeight="medium" fontSize="sm" truncate color="fg">
                              {t.sale_number}
                            </Text>
                            <HStack gap="1.5" mt="0.5">
                              <Text fontSize="xs" color="fg.muted" truncate>
                                {t.customer?.name ?? '-'}
                              </Text>
                              <Box as="span" w="1" h="1" rounded="full" bg="fg.subtle" />
                              <Box as={Clock} boxSize="2.5" color="fg.subtle" />
                              <Text fontSize="xs" color="fg.muted">{t.order_date}</Text>
                            </HStack>
                          </Box>
                        </HStack>
                        <Text fontSize="sm" fontWeight="semibold" color="fg" flexShrink="0">
                          {formatRupiah(t.total)}
                        </Text>
                      </Flex>
                    ))}
                  </VStack>
                )}
              </Card.Body>
            </Card.Root>

            <Card.Root variant="elevated">
              <Card.Header px={{ base: '4', md: '6' }} pt={{ base: '4', md: '5' }} pb="0">
                <Flex align="center" gap="2">
                  <AlertTriangle size={18} />
                  <Text fontWeight="semibold" fontSize="sm" color="fg">Stok Menipis</Text>
                </Flex>
              </Card.Header>
              <Card.Body px={{ base: '4', md: '6' }} pt="4" pb={{ base: '4', md: '5' }}>
                {dash!.low_stock_products.length === 0 ? (
                  <EmptyState.Root>
                    <EmptyState.Content>
                      <EmptyState.Indicator>
                        <Package size={40} />
                      </EmptyState.Indicator>
                      <EmptyState.Title>Semua stok aman</EmptyState.Title>
                      <EmptyState.Description>
                        Tidak ada produk dengan stok menipis
                      </EmptyState.Description>
                    </EmptyState.Content>
                  </EmptyState.Root>
                ) : (
                  <VStack gap="2">
                    {dash!.low_stock_products.map((p) => (
                      <Flex
                        key={p.id}
                        align="center"
                        justify="space-between"
                        rounded="lg"
                        borderWidth="1px"
                        borderColor="border"
                        px="4"
                        py="3"
                        transition="all 0.15s"
                        _hover={{ bg: 'bg.subtle' }}
                      >
                        <HStack gap="3" minW="0">
                          <Box
                            w="8"
                            h="8"
                            rounded="lg"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            bg="red.subtle"
                            color="red.fg"
                            flexShrink="0"
                          >
                            <Package size={14} />
                          </Box>
                          <Box minW="0">
                            <Text fontWeight="medium" fontSize="sm" truncate color="fg">
                              {p.name}
                            </Text>
                            <Text fontSize="xs" color="fg.muted">
                              SKU: {p.sku}
                            </Text>
                          </Box>
                        </HStack>
                        <Badge colorPalette="red" size="sm" flexShrink="0">
                          {p.stock} / {p.stock_minimum}
                        </Badge>
                      </Flex>
                    ))}
                  </VStack>
                )}
              </Card.Body>
            </Card.Root>
          </Grid>
        </motion.div>
      )}
    </VStack>
  )
}
