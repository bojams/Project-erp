import { useState, useMemo, useCallback } from 'react'
import { Box, Button, Card, Flex, Grid, Heading, Text, VStack, Spinner, Badge, Input, HStack, IconButton, Image, Separator, EmptyState, Portal, Dialog, NativeSelect, Field, useBreakpointValue, Table } from '@chakra-ui/react'
import { ShoppingCart, Plus, Minus, Trash2, Search, PackageOpen, Banknote, Smartphone, Eye, X, ChevronDown } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'motion/react'
import { saleApi } from '@/api/sales'
import { customerApi } from '@/api/customers'
import { productApi } from '@/api/products'
import { toaster } from '@/lib/toaster'
import type { Product } from '@/types/product'
import type { Customer } from '@/types/customer'
import type { Sale } from '@/types/sale'

interface CartItem {
  product: Product
  quantity: number
}

function formatRupiah(n: number) {
  return `Rp ${n.toLocaleString()}`
}

export function SalesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [customerId, setCustomerId] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris'>('cash')
  const [paidAmount, setPaidAmount] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [historyPage, setHistoryPage] = useState(1)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [showCart, setShowCart] = useState(false)
  const [lastAdded, setLastAdded] = useState<number | null>(null)
  const isMobile = useBreakpointValue({ base: true, md: false })

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products-pos'],
    queryFn: () => productApi.list({ per_page: 999, is_active: true }),
    select: (d) => d.items,
  })

  const { data: customers = [] } = useQuery({
    queryKey: ['customers-list'],
    queryFn: () => customerApi.list(),
  })

  const { data: salesData, isLoading: historyLoading } = useQuery({
    queryKey: ['sales', historyPage],
    queryFn: () => saleApi.list({ page: historyPage, per_page: 10 }),
    enabled: showHistory,
  })

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => saleApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['products-pos'] })
      setCart([])
      setPaidAmount('')
      setCustomerId('')
      setCustomerName('')
      setPaymentMethod('cash')
      toaster.success({ title: 'Transaksi Berhasil', description: 'Penjualan baru telah dicatat' })
    },
    onError: (err: Error) => {
      toaster.error({ title: 'Gagal', description: err.message })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => saleApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['products-pos'] })
      toaster.success({ title: 'Berhasil', description: 'Transaksi berhasil dihapus' })
    },
    onError: () => {
      toaster.error({ title: 'Gagal', description: 'Tidak dapat menghapus transaksi' })
    },
  })

  const filteredProducts = useMemo(() => {
    if (!productsData) return []
    if (!search.trim()) return productsData
    const q = search.toLowerCase()
    return productsData.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    )
  }, [productsData, search])

  const addToCart = useCallback((product: Product) => {
    if (product.stock <= 0) {
      toaster.warning({ title: 'Stok Habis', description: `"${product.name}" sudah habis, silahkan restock` })
      return
    }
    setLastAdded(product.id)
    setTimeout(() => setLastAdded(null), 600)
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id)
      if (existing) {
        return prev.map((c) =>
          c.product.id === product.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      }
      setShowCart(true)
      return [...prev, { product, quantity: 1 }]
    })
  }, [])

  const updateQuantity = useCallback((productId: number, delta: number) => {
    setCart((prev) => {
      const item = prev.find((c) => c.product.id === productId)
      if (!item) return prev
      if (delta > 0 && item.quantity + delta > item.product.stock) {
        toaster.warning({ title: 'Stok Tidak Mencukupi', description: `Stok "${item.product.name}" hanya tersisa ${item.product.stock}` })
        return prev
      }
      return prev
        .map((c) =>
          c.product.id === productId
            ? { ...c, quantity: Math.max(1, c.quantity + delta) }
            : c
        )
        .filter((c) => c.quantity > 0)
    })
  }, [])

  const setItemQuantity = useCallback((productId: number, value: number) => {
    if (value < 1) return
    setCart((prev) => {
      const item = prev.find((c) => c.product.id === productId)
      if (!item) return prev
      if (value > item.product.stock) {
        toaster.warning({ title: 'Stok Tidak Mencukupi', description: `Stok "${item.product.name}" hanya tersisa ${item.product.stock}` })
        return prev
      }
      return prev.map((c) =>
        c.product.id === productId ? { ...c, quantity: value } : c
      )
    })
  }, [])

  const removeFromCart = useCallback((productId: number) => {
    setCart((prev) => prev.filter((c) => c.product.id !== productId))
  }, [])

  const subtotal = useMemo(
    () => cart.reduce((sum, c) => sum + c.quantity * c.product.selling_price, 0),
    [cart]
  )
  const paid = paymentMethod === 'qris' ? subtotal : (Number(paidAmount) || 0)
  const change = paid - subtotal
  const canSubmit = cart.length > 0 && (paymentMethod === 'qris' || paid >= subtotal)

  const handleSubmit = () => {
    if (!canSubmit) return
    createMutation.mutate({
      customer_id: customerId ? Number(customerId) : null,
      customer_name: customerId ? null : (customerName || null),
      order_date: new Date().toISOString().split('T')[0],
      notes: null,
      payment_method: paymentMethod,
      amount_paid: paid,
      items: cart.map((c) => ({
        product_id: c.product.id,
        quantity: c.quantity,
        unit_price: c.product.selling_price,
      })),
    })
  }

  const getCustomerLabel = (sale: Sale) => {
    if (sale.customer_name) return sale.customer_name
    if (sale.customer?.name) return sale.customer.name
    return 'Umum'
  }

  const statusPalette: Record<string, string> = {
    completed: 'green', pending: 'yellow', cancelled: 'red',
  }

  if (productsLoading) {
    return (
      <Flex minH="60vh" align="center" justify="center">
        <Spinner color="orange.600" size="lg" />
      </Flex>
    )
  }

  const cartPanel = (
    <>
      <Flex align="center" justify="space-between" mb="2" pt="1">
        <Text fontSize="sm" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="wide">
          Keranjang ({cart.length})
        </Text>
        {isMobile && (
          <Button size="xs" variant="ghost" onClick={() => setShowCart(false)}>
            <X size={14} />
          </Button>
        )}
      </Flex>

      {cart.length > 0 && (
        <Flex direction="column" gap="2" flex="1" overflowY="auto" minH="0" mb="3">
          <AnimatePresence mode="popLayout">
            {cart.map((c) => (
              <motion.div
                key={c.product.id}
                layout
                initial={{ opacity: 0, x: 40, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: -40, height: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <Flex p="2" bg="bg.subtle" rounded="xl" gap="2.5" align="stretch">
                  <Box
                    w="11"
                    h="11"
                    rounded="lg"
                    bg="bg.emphasized"
                    flexShrink="0"
                    overflow="hidden"
                    alignSelf="center"
                  >
                    {c.product.image_thumb ? (
                      <img src={c.product.image_thumb} alt={c.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Flex w="full" h="full" align="center" justify="center">
                        <PackageOpen size={16} opacity={0.3} />
                      </Flex>
                    )}
                  </Box>
                  <Box flex="1" minW="0">
                    <Text fontSize="xs" fontWeight="medium" css={{ lineClamp: 2 }} color="fg" mb="0.5">
                      {c.product.name}
                    </Text>
                    <Text fontSize="xs" color="fg.muted">
                      {formatRupiah(c.product.selling_price)} × {c.quantity}
                    </Text>
                    <Flex align="center" justify="space-between" mt="1.5">
                      <HStack gap="0.5">
                        <IconButton
                          aria-label="Kurangi"
                          size="2xs"
                          variant="ghost"
                          onClick={() => updateQuantity(c.product.id, -1)}
                        >
                          <Minus size={10} />
                        </IconButton>
                        <Input
                          size="2xs"
                          w="10"
                          p="0"
                          textAlign="center"
                          inputMode="numeric"
                          value={c.quantity}
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(/\D/g, '')
                            const v = parseInt(cleaned, 10)
                            if (cleaned && !isNaN(v)) setItemQuantity(c.product.id, v)
                          }}
                        />
                        <IconButton
                          aria-label="Tambah"
                          size="2xs"
                          variant="ghost"
                          onClick={() => updateQuantity(c.product.id, 1)}
                        >
                          <Plus size={10} />
                        </IconButton>
                      </HStack>
                      <HStack gap="1.5">
                        <Text fontSize="sm" fontWeight="semibold" color="fg">
                          {formatRupiah(c.quantity * c.product.selling_price)}
                        </Text>
                        <IconButton
                          aria-label="Hapus"
                          size="xs"
                          variant="ghost"
                          color="fg.error"
                          onClick={() => removeFromCart(c.product.id)}
                        >
                          <Trash2 size={11} />
                        </IconButton>
                      </HStack>
                    </Flex>
                  </Box>
                </Flex>
              </motion.div>
            ))}
          </AnimatePresence>
        </Flex>
      )}

      {cart.length === 0 && (
        <Flex align="center" justify="center" py="8" flex="1" color="fg.subtle" flexDirection="column" gap="1">
          <ShoppingCart size={28} opacity={0.3} />
          <Text fontSize="xs">Belum ada item</Text>
        </Flex>
      )}

      <Separator mb="2" />

      <Flex direction="column" gap="2">
        <Flex align="center" justify="space-between">
          <Text fontSize="sm" color="fg.muted">Total</Text>
          <Text fontSize="xl" fontWeight="bold" color="fg">
            {formatRupiah(subtotal)}
          </Text>
        </Flex>

        <Text fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="wide">
          Metode Pembayaran
        </Text>
        <Flex gap="2">
          <Button
            flex="1"
            size="sm"
            variant={paymentMethod === 'cash' ? 'solid' : 'outline'}
            colorPalette={paymentMethod === 'cash' ? 'orange' : 'gray'}
            onClick={() => setPaymentMethod('cash')}
          >
            <Banknote size={16} />
            Cash
          </Button>
          <Button
            flex="1"
            size="sm"
            variant={paymentMethod === 'qris' ? 'solid' : 'outline'}
            colorPalette={paymentMethod === 'qris' ? 'orange' : 'gray'}
            onClick={() => setPaymentMethod('qris')}
          >
            <Smartphone size={16} />
            QRIS
          </Button>
        </Flex>

        {paymentMethod === 'cash' && (
          <>
            <Field.Root>
              <Field.Label fontSize="xs">Bayar (Rp)</Field.Label>
              <Input
                inputMode="numeric"
                placeholder="0"
                value={paidAmount}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, '')
                  setPaidAmount(cleaned)
                }}
                size="lg"
                textAlign="right"
                fontWeight="bold"
              />
            </Field.Root>

            {Number(paidAmount) > 0 && (
              <Flex align="center" justify="space-between">
                <Text fontSize="sm" color="fg.muted">Kembali</Text>
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color={change >= 0 ? 'green.600' : 'red.600'}
                >
                  {formatRupiah(Math.max(0, change))}
                </Text>
              </Flex>
            )}
          </>
        )}

        {paymentMethod === 'qris' && (
          <Flex align="center" justify="center" py="3" flexDirection="column" gap="1">
            <Smartphone size={32} opacity={0.4} />
            <Text fontSize="xs" color="fg.muted" textAlign="center">
              Pembayaran QRIS — nominal akan diproses sesuai total
            </Text>
          </Flex>
        )}

        <NativeSelect.Root size="sm">
          <NativeSelect.Field value={customerId} onChange={(e) => { setCustomerId(e.target.value); if (e.target.value) setCustomerName('') }}>
            <option value="">Pelanggan Umum</option>
            {customers.map((c: Customer) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>

        {!customerId && (
          <Field.Root>
            <Field.Label fontSize="xs">Nama Pelanggan (opsional)</Field.Label>
            <Input
              size="sm"
              placeholder="Masukkan nama pelanggan..."
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </Field.Root>
        )}

        <Button
          size="lg"
          colorScheme="orange"
          disabled={!canSubmit}
          loading={createMutation.isPending}
          loadingText="Memproses..."
          onClick={handleSubmit}
          bg={canSubmit ? 'orange.600' : undefined}
          _hover={canSubmit ? { bg: 'orange.500' } : undefined}
        >
          <ShoppingCart size={16} />
          {subtotal === 0
            ? 'Pilih Produk'
            : paymentMethod === 'cash' && paid < subtotal && Number(paidAmount) > 0
              ? `Kurang ${formatRupiah(subtotal - paid)}`
              : 'Buat Transaksi'}
        </Button>
      </Flex>
    </>
  )

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
      <Flex direction={isMobile ? 'column' : 'row'} gap="0" minH={{ base: 'calc(100vh - 120px)', md: 'calc(100vh - 120px)' }} mx={{ base: '0', md: '-6' }}>
        {/* Left Panel - Product Grid */}
        <Flex direction="column" flex="1" minW="0" p={{ base: '0', md: '0' }} pl={{ md: '6' }} pr={{ md: '3' }}>
          <Flex align="center" justify="space-between" wrap="wrap" gap="3" mb="4">
            <Flex align="center" gap="3">
              <Flex w="10" h="10" align="center" justify="center" rounded="xl" bg="orange.subtle" color="orange.fg">
                <ShoppingCart size={20} />
              </Flex>
              <Box>
                <Heading size="lg" fontWeight="bold" letterSpacing="tight">Penjualan</Heading>
                <Text color="fg.muted" fontSize="sm">Klik produk untuk menambahkan ke keranjang</Text>
              </Box>
            </Flex>
            <Flex gap="2">
              <Button variant="outline" size="sm" onClick={() => setShowHistory(true)}>
                Riwayat
              </Button>
            </Flex>
          </Flex>

          <Box position="relative" mb="4">
            <Input
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              ps="10"
            />
            <Box position="absolute" left="3" top="50%" transform="translateY(-50%)" color="fg.subtle" pointerEvents="none">
              <Search size={16} />
            </Box>
          </Box>

          {filteredProducts.length === 0 ? (
            <Flex align="center" justify="center" py="16" color="fg.muted" flexDirection="column" gap="2">
              <PackageOpen size={48} opacity={0.3} />
              <Text fontSize="sm">Produk tidak ditemukan</Text>
            </Flex>
          ) : (
            <Grid
              templateColumns={{
                base: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
                xl: 'repeat(5, 1fr)',
              }}
              gap="3"
              overflowY="auto"
              maxH={{ md: 'calc(100vh - 300px)' }}
              pb={isMobile ? '28' : '4'}
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  whileTap={product.stock > 0 ? { scale: 0.95 } : undefined}
                >
                  <Card.Root
                    variant="elevated"
                    cursor={product.stock <= 0 ? 'not-allowed' : 'pointer'}
                    opacity={product.stock <= 0 ? 0.45 : 1}
                    onClick={() => addToCart(product)}
                    _hover={product.stock > 0 ? { shadow: 'lg' } : undefined}
                    transition="all 0.15s"
                    position="relative"
                    overflow="hidden"
                  >
                    {lastAdded === product.id && (
                      <Box
                        position="absolute"
                        inset="0"
                        bg="orange.500"
                        opacity="0.15"
                        zIndex="1"
                        pointerEvents="none"
                        animation="pulse 0.6s ease-out"
                      />
                    )}
                    <Card.Body p="3">
                      <Flex
                        w="full"
                        h="20"
                        bg="bg.subtle"
                        rounded="md"
                        mb="2"
                        align="center"
                        justify="center"
                        overflow="hidden"
                      >
                        {product.image_thumb ? (
                          <Image src={product.image_thumb} alt={product.name} w="full" h="full" objectFit="cover" />
                        ) : (
                          <PackageOpen size={24} opacity={0.3} />
                        )}
                      </Flex>
                      <Text fontSize="xs" fontWeight="medium" css={{ lineClamp: 2 }} minH="2.5em" color="fg">
                        {product.name}
                      </Text>
                      <Text fontSize="sm" fontWeight="bold" color="orange.600" mt="1">
                        {formatRupiah(product.selling_price)}
                      </Text>
                      <Badge size="xs" colorPalette={product.stock > 0 ? 'green' : 'red'} mt="1">
                        Stok: {product.stock > 0 ? product.stock : 'Habis'}
                      </Badge>
                    </Card.Body>
                  </Card.Root>
                </motion.div>
              ))}
            </Grid>
          )}
        </Flex>

        {/* Desktop Cart Sidebar */}
        {!isMobile && (
          <Box
            w="360px"
            flexShrink="0"
            border="1px solid"
            borderColor="border"
            rounded="2xl"
            shadow="sm"
            bg="bg.panel"
            position="sticky"
            top="3"
            maxH="calc(100vh - 140px)"
            display="flex"
            flexDirection="column"
            px="5"
            pt="1"
            pb="4"
            overflow="hidden"
          >
            {cartPanel}
          </Box>
        )}
      </Flex>

      {/* Mobile Cart Bottom Sheet */}
      {isMobile && (
        <>
          {!showCart && cart.length > 0 && (
            <Box
              position="fixed"
              bottom="0"
              left="0"
              right="0"
              zIndex="docked"
              bg="bg.panel"
              borderTop="1px solid"
              borderColor="border"
              px="4"
              py="3"
              shadow="lg"
              roundedTop="2xl"
            >
              <Flex align="center" justify="space-between">
                <Flex align="center" gap="2">
                  <ShoppingCart size={18} />
                  <Text fontWeight="bold">{cart.length} item</Text>
                </Flex>
                <Flex align="center" gap="3">
                  <Text fontSize="lg" fontWeight="bold" color="orange.600">{formatRupiah(subtotal)}</Text>
                  <Button size="sm" onClick={() => setShowCart(true)}>
                    <ChevronDown size={16} />
                    Detail
                  </Button>
                </Flex>
              </Flex>
            </Box>
          )}

          <AnimatePresence>
            {showCart && (
              <>
                <Box
                  position="fixed"
                  inset="0"
                  bg="blackAlpha.500"
                  zIndex="modal"
                  onClick={() => setShowCart(false)}
                />
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 'modal',
                    maxHeight: '85vh',
                    background: 'var(--chakra-colors-bg-panel)',
                    borderTopLeftRadius: 'var(--chakra-radii-2xl)',
                    borderTopRightRadius: 'var(--chakra-radii-2xl)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    boxShadow: '0 -8px 30px rgba(0,0,0,0.12)',
                  }}
                >
                  <Flex direction="column" overflowY="auto" p="4" gap="0" flex="1">
                    {cartPanel}
                  </Flex>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}

      {/* History Dialog */}
      <Dialog.Root open={showHistory} onOpenChange={(e) => { if (!e.open) { setShowHistory(false); setSelectedSale(null) } }} placement="center" size={{ base: 'md', md: 'lg' }}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>
                  {selectedSale ? `Detail Transaksi - ${selectedSale.sale_number}` : 'Riwayat Transaksi'}
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                {selectedSale ? (
                  <VStack gap="4" align="stretch">
                    <Flex justify="space-between" align="center">
                      <Button size="xs" variant="ghost" onClick={() => setSelectedSale(null)}>
                        &larr; Kembali
                      </Button>
                    </Flex>

                    <Flex direction="column" gap="1" p="3" bg="bg.subtle" rounded="lg">
                      <Flex justify="space-between">
                        <Text fontSize="xs" color="fg.muted">No. Transaksi</Text>
                        <Text fontSize="sm" fontWeight="semibold">{selectedSale.sale_number}</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontSize="xs" color="fg.muted">Tanggal</Text>
                        <Text fontSize="sm">{new Date(selectedSale.order_date).toLocaleDateString()}</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontSize="xs" color="fg.muted">Pelanggan</Text>
                        <Text fontSize="sm">{getCustomerLabel(selectedSale)}</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontSize="xs" color="fg.muted">Pembayaran</Text>
                        <Badge size="xs" colorPalette={selectedSale.payment_method === 'cash' ? 'blue' : 'purple'}>
                          {selectedSale.payment_method?.toUpperCase() || 'CASH'}
                        </Badge>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontSize="xs" color="fg.muted">Status</Text>
                        <Badge size="xs" colorPalette={statusPalette[selectedSale.status]}>{selectedSale.status}</Badge>
                      </Flex>
                      {selectedSale.created_by && (
                        <Flex justify="space-between">
                          <Text fontSize="xs" color="fg.muted">Kasir</Text>
                          <Text fontSize="sm">{selectedSale.created_by.name}</Text>
                        </Flex>
                      )}
                    </Flex>

                    <Text fontSize="sm" fontWeight="semibold">Item</Text>
                    {selectedSale.items && selectedSale.items.length > 0 ? (
                      <>
                        <Box display={{ base: 'none', md: 'block' }}>
                          <Table.Root size="sm">
                            <Table.Header>
                              <Table.Row>
                                <Table.ColumnHeader>Produk</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">Qty</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="right">Harga</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="right">Subtotal</Table.ColumnHeader>
                              </Table.Row>
                            </Table.Header>
                            <Table.Body>
                              {selectedSale.items.map((item) => (
                                <Table.Row key={item.id}>
                                  <Table.Cell>
                                    <Flex align="center" gap="2">
                                      <Box w="8" h="8" rounded="md" bg="bg.emphasized" overflow="hidden" flexShrink="0">
                                        {item.product?.image_thumb ? (
                                          <img src={item.product.image_thumb} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                          <Flex w="full" h="full" align="center" justify="center">
                                            <PackageOpen size={12} opacity={0.3} />
                                          </Flex>
                                        )}
                                      </Box>
                                      <Text fontWeight="medium">{item.product?.name || `#${item.product_id}`}</Text>
                                    </Flex>
                                  </Table.Cell>
                                  <Table.Cell textAlign="center">{item.quantity}</Table.Cell>
                                  <Table.Cell textAlign="right">{formatRupiah(item.unit_price)}</Table.Cell>
                                  <Table.Cell textAlign="right" fontWeight="bold">{formatRupiah(item.subtotal)}</Table.Cell>
                                </Table.Row>
                              ))}
                            </Table.Body>
                          </Table.Root>
                        </Box>
                        <VStack display={{ md: 'none' }} gap="2">
                          {selectedSale.items.map((item) => (
                            <Flex
                              key={item.id}
                              w="full"
                              align="center"
                              justify="space-between"
                              p="3"
                              rounded="lg"
                              borderWidth="1px"
                              borderColor="border"
                              gap="3"
                            >
                              <Flex align="center" gap="2" minW="0" flex="1">
                                <Box w="8" h="8" rounded="md" bg="bg.emphasized" overflow="hidden" flexShrink="0">
                                  {item.product?.image_thumb ? (
                                    <img src={item.product.image_thumb} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  ) : (
                                    <Flex w="full" h="full" align="center" justify="center">
                                      <PackageOpen size={12} opacity={0.3} />
                                    </Flex>
                                  )}
                                </Box>
                                <Box minW="0">
                                  <Text fontWeight="medium" fontSize="sm" truncate>{item.product?.name || `#${item.product_id}`}</Text>
                                  <Text fontSize="xs" color="fg.muted">{item.quantity} × {formatRupiah(item.unit_price)}</Text>
                                </Box>
                              </Flex>
                              <Text fontWeight="bold" fontSize="sm" flexShrink="0">{formatRupiah(item.subtotal)}</Text>
                            </Flex>
                          ))}
                        </VStack>
                      </>
                    ) : (
                      <Text fontSize="sm" color="fg.muted">Tidak ada item</Text>
                    )}

                    <Separator />
                    <Flex direction="column" gap="1" align="end" w="full">
                      <Flex justify="space-between" w={{ base: 'full', sm: '200px' }}>
                        <Text fontSize="sm" color="fg.muted">Subtotal</Text>
                        <Text fontSize="sm">{formatRupiah(selectedSale.subtotal)}</Text>
                      </Flex>
                      <Flex justify="space-between" w={{ base: 'full', sm: '200px' }}>
                        <Text fontSize="md" fontWeight="bold">Total</Text>
                        <Text fontSize="md" fontWeight="bold">{formatRupiah(selectedSale.total)}</Text>
                      </Flex>
                      <Flex justify="space-between" w={{ base: 'full', sm: '200px' }}>
                        <Text fontSize="sm" color="fg.muted">Dibayar</Text>
                        <Text fontSize="sm">{formatRupiah(selectedSale.amount_paid)}</Text>
                      </Flex>
                    </Flex>
                  </VStack>
                ) : (
                  <>
                    {historyLoading ? (
                      <Flex py="8" justify="center"><Spinner color="orange.600" size="lg" /></Flex>
                    ) : !salesData?.items.length ? (
                      <EmptyState.Root>
                        <EmptyState.Content>
                          <EmptyState.Indicator><ShoppingCart size={40} /></EmptyState.Indicator>
                          <EmptyState.Title>Belum ada transaksi</EmptyState.Title>
                        </EmptyState.Content>
                      </EmptyState.Root>
                    ) : (
                      <VStack gap="3">
                        {salesData.items.map((sale) => (
                          <Flex
                            key={sale.id}
                            p="3"
                            bg="bg.subtle"
                            rounded="lg"
                            w="full"
                            align="center"
                            justify="space-between"
                            gap="3"
                            cursor="pointer"
                            onClick={() => setSelectedSale(sale)}
                            _hover={{ bg: 'bg.emphasized' }}
                            transition="background 0.1s"
                          >
                            <Box minW="0" flex="1">
                              <Flex align="center" gap="2">
                                <Text fontSize="sm" fontWeight="medium" color="fg">{sale.sale_number}</Text>
                                <Badge size="xs" colorPalette={sale.payment_method === 'cash' ? 'blue' : 'purple'}>
                                  {sale.payment_method?.toUpperCase() || 'CASH'}
                                </Badge>
                              </Flex>
                              <Text fontSize="xs" color="fg.muted">
                                {new Date(sale.order_date).toLocaleDateString()} · {getCustomerLabel(sale)}
                              </Text>
                            </Box>
                            <Box textAlign="right" flexShrink="0">
                              <Text fontSize="sm" fontWeight="bold" color="fg">{formatRupiah(sale.total)}</Text>
                              <Badge size="xs" colorPalette={statusPalette[sale.status]}>{sale.status}</Badge>
                            </Box>
                            <IconButton
                              aria-label="Detail"
                              size="xs"
                              variant="ghost"
                              onClick={(e) => { e.stopPropagation(); setSelectedSale(sale) }}
                            >
                              <Eye size={14} />
                            </IconButton>
                            <IconButton
                              aria-label="Hapus"
                              size="xs"
                              variant="ghost"
                              color="fg.error"
                              loading={deleteMutation.isPending}
                              onClick={(e) => {
                                e.stopPropagation()
                                if (window.confirm('Hapus transaksi ini?')) deleteMutation.mutate(sale.id)
                              }}
                            >
                              <Trash2 size={14} />
                            </IconButton>
                          </Flex>
                        ))}
                      </VStack>
                    )}
                    {salesData?.pagination && salesData.pagination.last_page > 1 && (
                      <Flex justify="center" gap="2" mt="4" wrap="wrap">
                        {Array.from({ length: salesData.pagination.last_page }, (_, i) => i + 1).map((p) => (
                          <Button key={p} size="xs" variant={historyPage === p ? 'solid' : 'outline'} onClick={() => setHistoryPage(p)}>
                            {p}
                          </Button>
                        ))}
                      </Flex>
                    )}
                  </>
                )}
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={() => { if (selectedSale) { setSelectedSale(null) } else { setShowHistory(false) } }}>
                  {selectedSale ? 'Tutup' : 'Tutup'}
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </motion.div>
  )
}
