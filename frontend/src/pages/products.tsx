import { useState } from 'react'
import { Box, Button, Card, Flex, Heading, IconButton, Input, Spinner, Table, Text, VStack, Badge, EmptyState, HStack } from '@chakra-ui/react'
import { Package, Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight, SlidersHorizontal, AlertTriangle } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { ProductFormModal } from '@/features/products/product-form-modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { productApi } from '@/api/products'
import { toaster } from '@/lib/toaster'
import type { Product } from '@/types/product'

export function ProductsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  const { data: listData, isLoading, isError } = useQuery({
    queryKey: ['products', search, page],
    queryFn: () => productApi.list({ search: search || undefined, page, per_page: 10 }),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productApi.categories(),
  })

  const { data: units } = useQuery({
    queryKey: ['units'],
    queryFn: () => productApi.units(),
  })

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => productApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setModalOpen(false)
      setEditingProduct(null)
      setErrorMessage(null)
      toaster.success({ title: 'Produk berhasil ditambahkan' })
    },
    onError: (err) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal menyimpan produk'
      setErrorMessage(msg)
      toaster.error({ title: 'Gagal menyimpan', description: msg })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => productApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setModalOpen(false)
      setEditingProduct(null)
      setErrorMessage(null)
      toaster.success({ title: 'Produk berhasil diperbarui' })
    },
    onError: (err) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal menyimpan perubahan'
      setErrorMessage(msg)
      toaster.error({ title: 'Gagal memperbarui', description: msg })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setDeletingProduct(null)
      toaster.success({ title: 'Produk berhasil dihapus' })
    },
    onError: () => {
      toaster.error({ title: 'Gagal menghapus produk' })
    },
  })

  const handleSave = (data: Record<string, unknown>) => {
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const products = listData?.items ?? []
  const pagination = listData?.pagination

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
    <VStack gap="6" align="stretch">
      <Flex align="center" justify="space-between" wrap="wrap" gap="4">
        <Flex align="center" gap="3">
          <Flex
            w="10"
            h="10"
            align="center"
            justify="center"
            rounded="xl"
            bg="blue.subtle"
            color="blue.fg"
          >
            <Package size={20} />
          </Flex>
          <Box>
            <Heading size="lg" fontWeight="bold" letterSpacing="tight">Produk</Heading>
            <Text color="fg.muted" fontSize="sm">Kelola daftar produk inventaris</Text>
          </Box>
        </Flex>
        <Button onClick={() => { setEditingProduct(null); setModalOpen(true) }}>
          <Plus size={16} />
          Tambah Produk
        </Button>
      </Flex>

      <Card.Root variant="elevated">
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          align={{ base: 'stretch', sm: 'center' }}
          justify="space-between"
          gap="3"
          px={{ base: '4', md: '6' }}
          py="4"
          borderBottomWidth="1px"
          borderColor="border"
        >
          <Box position="relative" maxW="sm" w="full">
            <Box
              as={Search}
              boxSize="4"
              position="absolute"
              left="3"
              top="50%"
              transform="translateY(-50%)"
              color="fg.subtle"
              pointerEvents="none"
            />
            <Input
              pl="10"
              placeholder="Cari nama, SKU, atau barcode..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            />
          </Box>
          <HStack gap="2">
            <Button variant="outline" size="sm" disabled>
              <SlidersHorizontal size={14} />
              Filter
            </Button>
          </HStack>
        </Flex>

        {isLoading ? (
          <Flex align="center" justify="center" py="20">
            <Spinner color="colorPalette.600" size="lg" />
          </Flex>
        ) : isError ? (
          <Box textAlign="center" py="20">
            <Box as={AlertTriangle} boxSize="10" mx="auto" color="red.500" />
            <Text mt="3" color="fg.error" fontSize="sm" fontWeight="medium">Gagal memuat data produk</Text>
            <Text mt="1" color="fg.muted" fontSize="xs" mb="4">Coba refresh halaman</Text>
            <Button size="sm" variant="outline" onClick={() => setPage(1)}>Muat Ulang</Button>
          </Box>
        ) : products.length === 0 ? (
          <EmptyState.Root py="16">
            <EmptyState.Content>
              <EmptyState.Indicator>
                <Package size={48} />
              </EmptyState.Indicator>
              <EmptyState.Title>Belum ada produk</EmptyState.Title>
              <EmptyState.Description>Tambahkan produk pertama Anda untuk memulai</EmptyState.Description>
              <Button size="sm" mt="4" onClick={() => { setEditingProduct(null); setModalOpen(true) }}>
                <Plus size={16} />
                Tambah Produk
              </Button>
            </EmptyState.Content>
          </EmptyState.Root>
        ) : (
          <>
            <Box display={{ base: 'none', md: 'block' }} overflowX="auto">
              <Table.Root w="full" fontSize="sm">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader px="4" py="3.5" textTransform="uppercase" fontSize="xs" fontWeight="semibold" letterSpacing="wide" color="fg.muted">Produk</Table.ColumnHeader>
                    <Table.ColumnHeader px="4" py="3.5" textTransform="uppercase" fontSize="xs" fontWeight="semibold" letterSpacing="wide" color="fg.muted">SKU</Table.ColumnHeader>
                    <Table.ColumnHeader px="4" py="3.5" textTransform="uppercase" fontSize="xs" fontWeight="semibold" letterSpacing="wide" color="fg.muted" display={{ base: 'none', md: 'table-cell' }}>Kategori</Table.ColumnHeader>
                    <Table.ColumnHeader px="4" py="3.5" textTransform="uppercase" fontSize="xs" fontWeight="semibold" letterSpacing="wide" color="fg.muted" textAlign="end">Harga Jual</Table.ColumnHeader>
                    <Table.ColumnHeader px="4" py="3.5" textTransform="uppercase" fontSize="xs" fontWeight="semibold" letterSpacing="wide" color="fg.muted" textAlign="end">Stok</Table.ColumnHeader>
                    <Table.ColumnHeader px="4" py="3.5" textTransform="uppercase" fontSize="xs" fontWeight="semibold" letterSpacing="wide" color="fg.muted" textAlign="end">Aksi</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {products.map((product) => (
                    <Table.Row key={product.id} _hover={{ bg: 'bg.subtle' }} transition="background 0.12s">
                      <Table.Cell px="4" py="3">
                        <Flex align="center" gap="3">
                          {product.image_thumb ? (
                            <Box
                              w="9"
                              h="9"
                              rounded="lg"
                              overflow="hidden"
                              flexShrink="0"
                            >
                              <img
                                src={product.image_thumb}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </Box>
                          ) : (
                            <Flex w="9" h="9" align="center" justify="center" rounded="lg" bg="colorPalette.subtle" color="colorPalette.fg" flexShrink="0">
                              <Package size={16} />
                            </Flex>
                          )}
                          <Box minW="0">
                            <Text fontWeight="medium" color="fg" truncate>{product.name}</Text>
                            <Text fontSize="xs" color="fg.muted">{product.unit?.name ?? '-'}</Text>
                          </Box>
                        </Flex>
                      </Table.Cell>
                      <Table.Cell px="4" py="3">
                        <Text fontFamily="monospace" fontSize="xs" color="fg.muted">{product.sku}</Text>
                      </Table.Cell>
                      <Table.Cell px="4" py="3" display={{ base: 'none', md: 'table-cell' }}>
                        {product.category ? (
                          <Badge colorPalette="gray" size="sm">{product.category.name}</Badge>
                        ) : (
                          <Text fontSize="xs" color="fg.subtle">-</Text>
                        )}
                      </Table.Cell>
                      <Table.Cell px="4" py="3" textAlign="end">
                        <Text fontWeight="semibold" color="fg" fontSize="sm">
                          Rp{product.selling_price.toLocaleString('id-ID')}
                        </Text>
                      </Table.Cell>
                      <Table.Cell px="4" py="3" textAlign="end">
                        <Badge colorPalette={product.is_low_stock ? 'red' : 'green'} size="sm">
                          {product.stock} {product.unit?.short_code ?? ''}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell px="4" py="3" textAlign="end">
                        <HStack gap="1" justify="flex-end">
                          <IconButton
                            aria-label="Edit produk"
                            variant="ghost"
                            size="xs"
                            color="fg.subtle"
                            _hover={{ color: 'blue.fg', bg: 'blue.subtle' }}
                            onClick={() => { setEditingProduct(product); setModalOpen(true) }}
                          >
                            <Pencil size={15} />
                          </IconButton>
                          <IconButton
                            aria-label="Hapus produk"
                            variant="ghost"
                            size="xs"
                            color="fg.subtle"
                            _hover={{ color: 'red.fg', bg: 'red.subtle' }}
                            onClick={() => setDeletingProduct(product)}
                          >
                            <Trash2 size={15} />
                          </IconButton>
                        </HStack>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>

            <VStack display={{ md: 'none' }} gap="3" p="4">
              {products.map((product) => (
                <Card.Root key={product.id} w="full" variant="elevated">
                  <Card.Body p="4">
                    <Flex align="center" gap="3" mb="3">
                      {product.image_thumb ? (
                        <Box w="10" h="10" rounded="lg" overflow="hidden" flexShrink="0">
                          <img
                            src={product.image_thumb}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                      ) : (
                        <Flex w="10" h="10" align="center" justify="center" rounded="lg" bg="colorPalette.subtle" color="colorPalette.fg" flexShrink="0">
                          <Package size={18} />
                        </Flex>
                      )}
                      <Box minW="0" flex="1">
                        <Text fontWeight="semibold" color="fg" truncate>{product.name}</Text>
                        <Text fontSize="xs" color="fg.muted">{product.sku}</Text>
                      </Box>
                      <Badge colorPalette={product.is_low_stock ? 'red' : 'green'} size="sm" flexShrink="0">
                        {product.stock} {product.unit?.short_code ?? ''}
                      </Badge>
                    </Flex>
                    <Flex align="center" justify="space-between">
                      <HStack gap="2">
                        {product.category && (
                          <Badge colorPalette="gray" size="sm">{product.category.name}</Badge>
                        )}
                        <Text fontWeight="semibold" color="fg" fontSize="sm">
                          Rp{product.selling_price.toLocaleString('id-ID')}
                        </Text>
                      </HStack>
                      <HStack gap="1">
                        <IconButton
                          aria-label="Edit produk"
                          variant="ghost"
                          size="xs"
                          color="fg.subtle"
                          _hover={{ color: 'blue.fg', bg: 'blue.subtle' }}
                          onClick={() => { setEditingProduct(product); setModalOpen(true) }}
                        >
                          <Pencil size={16} />
                        </IconButton>
                        <IconButton
                          aria-label="Hapus produk"
                          variant="ghost"
                          size="xs"
                          color="fg.subtle"
                          _hover={{ color: 'red.fg', bg: 'red.subtle' }}
                          onClick={() => setDeletingProduct(product)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </HStack>
                    </Flex>
                  </Card.Body>
                </Card.Root>
              ))}
            </VStack>

            {pagination && pagination.last_page > 1 && (
              <Flex
                direction={{ base: 'column', sm: 'row' }}
                align="center"
                justify="space-between"
                gap="3"
                borderTopWidth="1px"
                borderColor="border"
                px={{ base: '4', md: '6' }}
                py="4"
              >
                <Text fontSize="sm" color="fg.muted" order={{ base: 2, sm: 1 }}>
                  Menampilkan {((pagination.current_page - 1) * pagination.per_page) + 1} - {Math.min(pagination.current_page * pagination.per_page, pagination.total)} dari {pagination.total}
                </Text>
                <HStack gap="2" order={{ base: 1, sm: 2 }}>
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                    <ChevronLeft size={15} />
                  </Button>
                  <Flex align="center" gap="1.5" px="2">
                    <Text fontSize="sm" fontWeight="medium" color="fg">{pagination.current_page}</Text>
                    <Text fontSize="sm" color="fg.subtle">/</Text>
                    <Text fontSize="sm" color="fg.muted">{pagination.last_page}</Text>
                  </Flex>
                  <Button variant="outline" size="sm" disabled={page >= pagination.last_page} onClick={() => setPage(page + 1)}>
                    <ChevronRight size={15} />
                  </Button>
                </HStack>
              </Flex>
            )}
          </>
        )}
      </Card.Root>

      <ProductFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingProduct(null); setErrorMessage(null) }}
        onSave={handleSave}
        product={editingProduct}
        categories={categories ?? []}
        units={units ?? []}
        isLoading={createMutation.isPending || updateMutation.isPending}
        errorMessage={errorMessage}
      />

      <ConfirmDialog
        open={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={() => {
          if (deletingProduct) deleteMutation.mutate(deletingProduct.id)
        }}
        title="Hapus Produk"
        message={`Apakah Anda yakin ingin menghapus "${deletingProduct?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        isLoading={deleteMutation.isPending}
      />
    </VStack>
    </motion.div>
  )
}
