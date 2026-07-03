import { useState, useMemo, useCallback } from 'react'
import { Box, Button, Card, Flex, Grid, Heading, Text, VStack, Spinner, Badge, Input, HStack, IconButton, Image, Separator, EmptyState, Portal, Dialog, Field, useBreakpointValue, Table } from '@chakra-ui/react'
import { Truck, Plus, Minus, Trash2, Search, PackageOpen, Eye, ChevronDown } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'motion/react'
import { purchaseApi } from '@/api/purchases'
import { productApi } from '@/api/products'
import { toaster } from '@/lib/toaster'
import type { Product } from '@/types/product'
import type { Purchase } from '@/types/purchase'

interface CartItem {
  product: Product
  quantity: number
}

function formatRupiah(n: number) {
  return `Rp ${n.toLocaleString()}`
}

const statusPalette: Record<string, string> = {
  received: 'green', approved: 'blue', pending: 'yellow', cancelled: 'red',
}

export function PurchasesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [supplierName, setSupplierName] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [historyPage, setHistoryPage] = useState(1)
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [showCart, setShowCart] = useState(false)
  const [lastAdded, setLastAdded] = useState<number | null>(null)
  const isMobile = useBreakpointValue({ base: true, md: false })

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products-purchase'],
    queryFn: () => productApi.list({ per_page: 999, is_active: true }),
    select: (d) => d.items,
  })

  const { data: purchasesData, isLoading: historyLoading } = useQuery({
    queryKey: ['purchases', historyPage],
    queryFn: () => purchaseApi.list({ page: historyPage, per_page: 10 }),
    enabled: showHistory,
  })

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => purchaseApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['products-purchase'] })
      setCart([])
      setSupplierName('')
      toaster.success({ title: 'Pembelian Berhasil', description: 'Pembelian baru telah dicatat' })
    },
    onError: (err: Error) => {
      toaster.error({ title: 'Gagal', description: err.message })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => purchaseApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['products-purchase'] })
      toaster.success({ title: 'Berhasil', description: 'Pembelian berhasil dihapus' })
    },
    onError: () => {
      toaster.error({ title: 'Gagal', description: 'Tidak dapat menghapus pembelian' })
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
    setCart((prev) =>
      prev
        .map((c) =>
          c.product.id === productId
            ? { ...c, quantity: Math.max(1, c.quantity + delta) }
            : c
        )
        .filter((c) => c.quantity > 0)
    )
  }, [])

  const setItemQuantity = useCallback((productId: number, value: number) => {
    if (value < 1) return
    setCart((prev) =>
      prev.map((c) =>
        c.product.id === productId ? { ...c, quantity: value } : c
      )
    )
  }, [])

  const removeFromCart = useCallback((productId: number) => {
    setCart((prev) => prev.filter((c) => c.product.id !== productId))
  }, [])

  const subtotal = useMemo(
    () => cart.reduce((sum, c) => sum + c.quantity * c.product.purchase_price, 0),
    [cart]
  )

  const canSubmit = cart.length > 0 && !!supplierName.trim()

  const handleSubmit = () => {
    if (!canSubmit) return
    createMutation.mutate({
      supplier_name: supplierName.trim() || null,
      order_date: new Date().toISOString().split('T')[0],
      notes: null,
      items: cart.map((c) => ({
        product_id: c.product.id,
        quantity: c.quantity,
        unit_price: c.product.purchase_price,
      })),
    })
  }

  if (productsLoading) {
    return (
      <Flex minH="60vh" align="center" justify="center">
        <Spinner color="teal.600" size="lg" />
      </Flex>
    )
  }

  const cartPanel = (
    <>
      <Flex align="center" justify="space-between" mb="2" pt="1">
        <Text fontSize="sm" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="wide">
          Item ({cart.length})
        </Text>
        {isMobile && (
          <Button size="xs" variant="ghost" onClick={() => setShowCart(false)}>
            <Trash2 size={14} />
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
                      {formatRupiah(c.product.purchase_price)} × {c.quantity}
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
                          {formatRupiah(c.quantity * c.product.purchase_price)}
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
          <PackageOpen size={28} opacity={0.3} />
          <Text fontSize="xs">Belum ada item</Text>
        </Flex>
      )}

      <Separator mb="2" />

      <Flex direction="column" gap="2">
        <Field.Root>
          <Field.Label fontSize="xs">Nama Pemasok</Field.Label>
          <Input
            size="sm"
            placeholder="Masukkan nama pemasok..."
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
          />
        </Field.Root>

        <Flex align="center" justify="space-between">
          <Text fontSize="sm" color="fg.muted">Total</Text>
          <Text fontSize="xl" fontWeight="bold" color="fg">
            {formatRupiah(subtotal)}
          </Text>
        </Flex>

        <Button
          size="lg"
          colorScheme="teal"
          disabled={!canSubmit}
          loading={createMutation.isPending}
          loadingText="Memproses..."
          onClick={handleSubmit}
          bg={canSubmit ? 'teal.600' : undefined}
          _hover={canSubmit ? { bg: 'teal.500' } : undefined}
        >
          <Plus size={16} />
          {!supplierName.trim() ? 'Masukkan Nama Pemasok' : subtotal === 0 ? 'Pilih Produk' : 'Buat Pembelian'}
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
              <Flex w="10" h="10" align="center" justify="center" rounded="xl" bg="teal.subtle" color="teal.fg">
                <Truck size={20} />
              </Flex>
              <Box>
                <Heading size="lg" fontWeight="bold" letterSpacing="tight">Pembelian</Heading>
                <Text color="fg.muted" fontSize="sm">Klik produk untuk menambahkan ke daftar</Text>
              </Box>
            </Flex>
            <Button variant="outline" size="sm" onClick={() => setShowHistory(true)}>
              Riwayat
            </Button>
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
                  whileTap={{ scale: 0.95 }}
                >
                  <Card.Root
                    variant="elevated"
                    cursor="pointer"
                    onClick={() => addToCart(product)}
                    _hover={{ shadow: 'lg' }}
                    transition="all 0.15s"
                    position="relative"
                    overflow="hidden"
                  >
                    {lastAdded === product.id && (
                      <Box
                        position="absolute"
                        inset="0"
                        bg="teal.500"
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
                      <Text fontSize="sm" fontWeight="bold" color="teal.600" mt="1">
                        {formatRupiah(product.purchase_price)}
                      </Text>
                      <Badge size="xs" colorPalette={product.stock > 0 ? 'gray' : 'red'} mt="1">
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
                  <Truck size={18} />
                  <Text fontWeight="bold">{cart.length} item</Text>
                </Flex>
                <Flex align="center" gap="3">
                  <Text fontSize="lg" fontWeight="bold" color="teal.600">{formatRupiah(subtotal)}</Text>
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
      <Dialog.Root open={showHistory} onOpenChange={(e) => { if (!e.open) { setShowHistory(false); setSelectedPurchase(null) } }} placement="center" size={{ base: 'md', md: 'lg' }}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>
                  {selectedPurchase ? `Detail Pembelian - ${selectedPurchase.purchase_number}` : 'Riwayat Pembelian'}
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                {selectedPurchase ? (
                  <VStack gap="4" align="stretch">
                    <Flex justify="space-between" align="center">
                      <Button size="xs" variant="ghost" onClick={() => setSelectedPurchase(null)}>
                        &larr; Kembali
                      </Button>
                    </Flex>

                    <Flex direction="column" gap="1" p="3" bg="bg.subtle" rounded="lg">
                      <Flex justify="space-between">
                        <Text fontSize="xs" color="fg.muted">No. Pembelian</Text>
                        <Text fontSize="sm" fontWeight="semibold">{selectedPurchase.purchase_number}</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontSize="xs" color="fg.muted">Tanggal</Text>
                        <Text fontSize="sm">{new Date(selectedPurchase.order_date).toLocaleDateString()}</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontSize="xs" color="fg.muted">Pemasok</Text>
                        <Text fontSize="sm">{selectedPurchase.supplier?.name || selectedPurchase.supplier_name || '-'}</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontSize="xs" color="fg.muted">Status</Text>
                        <Badge size="xs" colorPalette={statusPalette[selectedPurchase.status]}>{selectedPurchase.status}</Badge>
                      </Flex>
                      {selectedPurchase.created_by && (
                        <Flex justify="space-between">
                          <Text fontSize="xs" color="fg.muted">Pembuat</Text>
                          <Text fontSize="sm">{selectedPurchase.created_by.name}</Text>
                        </Flex>
                      )}
                    </Flex>

                    <Text fontSize="sm" fontWeight="semibold">Item</Text>
                    {selectedPurchase.items && selectedPurchase.items.length > 0 ? (
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
                              {selectedPurchase.items.map((item) => (
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
                          {selectedPurchase.items.map((item) => (
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
                        <Text fontSize="sm">{formatRupiah(selectedPurchase.subtotal)}</Text>
                      </Flex>
                      <Flex justify="space-between" w={{ base: 'full', sm: '200px' }}>
                        <Text fontSize="md" fontWeight="bold">Total</Text>
                        <Text fontSize="md" fontWeight="bold">{formatRupiah(selectedPurchase.total)}</Text>
                      </Flex>
                    </Flex>
                  </VStack>
                ) : (
                  <>
                    {historyLoading ? (
                      <Flex py="8" justify="center"><Spinner color="teal.600" size="lg" /></Flex>
                    ) : !purchasesData?.items.length ? (
                      <EmptyState.Root>
                        <EmptyState.Content>
                          <EmptyState.Indicator><Truck size={40} /></EmptyState.Indicator>
                          <EmptyState.Title>Belum ada pembelian</EmptyState.Title>
                        </EmptyState.Content>
                      </EmptyState.Root>
                    ) : (
                      <VStack gap="3">
                        {purchasesData.items.map((purchase) => (
                          <Flex
                            key={purchase.id}
                            p="3"
                            bg="bg.subtle"
                            rounded="lg"
                            w="full"
                            align="center"
                            justify="space-between"
                            gap="3"
                            cursor="pointer"
                            onClick={() => setSelectedPurchase(purchase)}
                            _hover={{ bg: 'bg.emphasized' }}
                            transition="background 0.1s"
                          >
                            <Box minW="0" flex="1">
                              <Text fontSize="sm" fontWeight="medium" color="fg">{purchase.purchase_number}</Text>
                              <Text fontSize="xs" color="fg.muted">
                                {new Date(purchase.order_date).toLocaleDateString()} · {purchase.supplier?.name || purchase.supplier_name || '-'}
                              </Text>
                            </Box>
                            <Box textAlign="right" flexShrink="0">
                              <Text fontSize="sm" fontWeight="bold" color="fg">{formatRupiah(purchase.total)}</Text>
                              <Badge size="xs" colorPalette={statusPalette[purchase.status]}>{purchase.status}</Badge>
                            </Box>
                            <IconButton
                              aria-label="Detail"
                              size="xs"
                              variant="ghost"
                              onClick={(e) => { e.stopPropagation(); setSelectedPurchase(purchase) }}
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
                                if (window.confirm('Hapus pembelian ini?')) deleteMutation.mutate(purchase.id)
                              }}
                            >
                              <Trash2 size={14} />
                            </IconButton>
                          </Flex>
                        ))}
                      </VStack>
                    )}
                    {purchasesData?.pagination && purchasesData.pagination.last_page > 1 && (
                      <Flex justify="center" gap="2" mt="4" wrap="wrap">
                        {Array.from({ length: purchasesData.pagination.last_page }, (_, i) => i + 1).map((p) => (
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
                <Button variant="outline" onClick={() => { if (selectedPurchase) { setSelectedPurchase(null) } else { setShowHistory(false) } }}>
                  {selectedPurchase ? 'Tutup' : 'Tutup'}
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </motion.div>
  )
}
