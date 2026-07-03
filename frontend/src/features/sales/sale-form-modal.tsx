import { useEffect, useState } from 'react'
import { Button, Dialog, Field, Grid, Input, NativeSelect, Portal, Text, Textarea, HStack, IconButton, VStack, Box, Flex } from '@chakra-ui/react'
import { Plus, Trash2 } from 'lucide-react'
import type { Customer } from '@/types/customer'
import type { Product } from '@/types/product'

interface SaleItemRow {
  product_id: string
  quantity: string
  unit_price: string
}

interface SaleFormModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: Record<string, unknown>) => void
  customers: Customer[]
  products: Product[]
  isLoading?: boolean
  errorMessage?: string | null
}

const emptyRow = (): SaleItemRow => ({ product_id: '', quantity: '1', unit_price: '0' })

export function SaleFormModal({ open, onClose, onSave, customers, products, isLoading, errorMessage }: SaleFormModalProps) {
  const [customerId, setCustomerId] = useState('')
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('unpaid')
  const [amountPaid, setAmountPaid] = useState('0')
  const [items, setItems] = useState<SaleItemRow[]>([emptyRow()])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return
    setCustomerId('')
    setOrderDate(new Date().toISOString().split('T')[0])
    setNotes('')
    setPaymentStatus('unpaid')
    setAmountPaid('0')
    setItems([emptyRow()])
    setErrors({})
  }, [open])

  const addRow = () => setItems(prev => [...prev, emptyRow()])
  const removeRow = (i: number) => setItems(prev => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev)

  const updateItem = (i: number, key: keyof SaleItemRow, value: string) => {
    setItems(prev => {
      const next = [...prev]
      next[i] = { ...next[i], [key]: value }
      if (key === 'product_id') {
        const product = products.find(p => String(p.id) === value)
        if (product) {
          next[i].unit_price = String(product.selling_price)
        }
      }
      return next
    })
    setErrors(prev => { const n = { ...prev }; delete n[`items.${i}.${key}`]; return n })
  }

  const subtotal = items.reduce((sum, row) => {
    return sum + (Number(row.quantity) || 0) * (Number(row.unit_price) || 0)
  }, 0)

  const handleSave = () => {
    const newErrors: Record<string, string> = {}
    if (!orderDate) newErrors.order_date = 'Tanggal harus diisi'

    items.forEach((row, i) => {
      if (!row.product_id) newErrors[`items.${i}.product_id`] = 'Pilih produk'
      if (!row.quantity || Number(row.quantity) < 1) newErrors[`items.${i}.quantity`] = 'Minimal 1'
      if (Number(row.unit_price) < 0) newErrors[`items.${i}.unit_price`] = 'Harga tidak valid'
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const payload: Record<string, unknown> = {
      customer_id: customerId ? Number(customerId) : null,
      order_date: orderDate,
      notes: notes.trim() || null,
      payment_status: paymentStatus,
      amount_paid: paymentStatus === 'paid' ? subtotal : Number(amountPaid),
      items: items.map(row => ({
        product_id: Number(row.product_id),
        quantity: Number(row.quantity),
        unit_price: Number(row.unit_price),
      })),
    }

    onSave(payload)
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => { if (!e.open) onClose() }} placement="center" size="lg">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Transaksi Baru</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack gap="4">
                {errorMessage && (
                  <Text color="fg.error" fontSize="sm" bg="bg.error" px="4" py="3" rounded="md" w="full">
                    {errorMessage}
                  </Text>
                )}

                <Grid templateColumns="repeat(2, 1fr)" gap="4" w="full">
                  <Field.Root>
                    <Field.Label>Pelanggan</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                        <option value="">Umum</option>
                        {customers.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Field.Root>
                  <Field.Root invalid={!!errors.order_date}>
                    <Field.Label>Tanggal</Field.Label>
                    <Input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
                    <Field.ErrorText>{errors.order_date}</Field.ErrorText>
                  </Field.Root>
                </Grid>

                <Field.Root>
                  <Field.Label>Status Pembayaran</Field.Label>
                  <NativeSelect.Root>
                    <NativeSelect.Field value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                      <option value="unpaid">Belum Dibayar</option>
                      <option value="paid">Lunas</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Field.Root>

                <Box w="full">
                  <Flex align="center" justify="space-between" mb="2">
                    <Text fontSize="sm" fontWeight="medium">Item</Text>
                    <Button size="xs" variant="outline" onClick={addRow}>
                      <Plus size={14} />
                      Tambah Item
                    </Button>
                  </Flex>
                  <VStack gap="3">
                    {items.map((row, i) => (
                      <Box key={i} p="3" borderWidth="1px" rounded="md" w="full" bg="bg.subtle">
                        <Grid templateColumns="1fr 80px 100px 36px" gap="2" alignItems="center">
                          <Field.Root invalid={!!errors[`items.${i}.product_id`]}>
                            <NativeSelect.Root>
                              <NativeSelect.Field value={row.product_id} onChange={(e) => updateItem(i, 'product_id', e.target.value)}>
                                <option value="">Pilih produk</option>
                                {products.map((p) => (
                                  <option key={p.id} value={p.id}>{p.name} (Rp {p.selling_price.toLocaleString()})</option>
                                ))}
                              </NativeSelect.Field>
                              <NativeSelect.Indicator />
                            </NativeSelect.Root>
                            <Field.ErrorText>{errors[`items.${i}.product_id`]}</Field.ErrorText>
                          </Field.Root>
                          <Field.Root invalid={!!errors[`items.${i}.quantity`]}>
                            <Input type="number" min="1" value={row.quantity} onChange={(e) => updateItem(i, 'quantity', e.target.value)} />
                            <Field.ErrorText>{errors[`items.${i}.quantity`]}</Field.ErrorText>
                          </Field.Root>
                          <Field.Root invalid={!!errors[`items.${i}.unit_price`]}>
                            <Input type="number" min="0" value={row.unit_price} onChange={(e) => updateItem(i, 'unit_price', e.target.value)} />
                            <Field.ErrorText>{errors[`items.${i}.unit_price`]}</Field.ErrorText>
                          </Field.Root>
                          <IconButton aria-label="Hapus item" variant="ghost" color="fg.error" size="sm" onClick={() => removeRow(i)}>
                            <Trash2 size={16} />
                          </IconButton>
                        </Grid>
                      </Box>
                    ))}
                  </VStack>
                </Box>

                <HStack w="full" justify="flex-end" gap="2">
                  <Text fontSize="sm" fontWeight="medium" color="fg.muted">Subtotal:</Text>
                  <Text fontSize="lg" fontWeight="bold" color="fg">Rp {subtotal.toLocaleString()}</Text>
                </HStack>

                <Field.Root>
                  <Field.Label>Catatan</Field.Label>
                  <Textarea placeholder="Catatan (opsional)" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
                </Field.Root>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer gap="3">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>Batal</Button>
              <Button onClick={handleSave} loading={isLoading} disabled={isLoading}>
                {isLoading ? 'Menyimpan...' : 'Buat Transaksi'}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
