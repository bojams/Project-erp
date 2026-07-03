import { useEffect, useState } from 'react'
import { Button, Dialog, Field, Grid, Input, NativeSelect, Portal, Text, Textarea, Checkbox, VStack } from '@chakra-ui/react'
import { ImageUpload } from '@/components/ui/image-upload'
import type { Product, Category, Unit } from '@/types/product'

interface ProductFormModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: Record<string, unknown>) => void
  product?: Product | null
  categories: Category[]
  units: Unit[]
  isLoading?: boolean
  errorMessage?: string | null
}

const emptyForm = {
  name: '',
  sku: '',
  barcode: '',
  description: '',
  category_id: '',
  unit_id: '',
  purchase_price: '0',
  selling_price: '0',
  stock: '0',
  stock_minimum: '0',
  is_active: true,
}

export function ProductFormModal({ open, onClose, onSave, product, categories, units, isLoading, errorMessage }: ProductFormModalProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageRemoved, setImageRemoved] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return
    setImageFile(null)
    setImageRemoved(false)
    setErrors({})
    if (product) {
      setForm({
        name: product.name,
        sku: product.sku,
        barcode: product.barcode || '',
        description: product.description || '',
        category_id: product.category?.id ? String(product.category.id) : '',
        unit_id: product.unit?.id ? String(product.unit.id) : '',
        purchase_price: String(product.purchase_price),
        selling_price: String(product.selling_price),
        stock: String(product.stock),
        stock_minimum: String(product.stock_minimum),
        is_active: product.is_active,
      })
    } else {
      setForm(emptyForm)
    }
  }, [product, open])

  const set = (key: keyof typeof emptyForm, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const handleSave = () => {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = 'Nama produk harus diisi'
    if (!form.sku.trim()) newErrors.sku = 'SKU harus diisi'
    if (!form.unit_id || form.unit_id === '0') newErrors.unit_id = 'Satuan harus dipilih'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      barcode: form.barcode.trim() || null,
      description: form.description.trim() || null,
      category_id: form.category_id ? Number(form.category_id) : null,
      unit_id: Number(form.unit_id),
      purchase_price: Number(form.purchase_price),
      selling_price: Number(form.selling_price),
      stock: Number(form.stock),
      stock_minimum: Number(form.stock_minimum),
      is_active: form.is_active,
    }

    if (imageFile) payload.image = imageFile
    else if (imageRemoved) payload.remove_image = true

    onSave(payload)
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => { if (!e.open) onClose() }} placement="center" size="md">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{product ? 'Edit Produk' : 'Tambah Produk'}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack gap="4">
                {errorMessage && (
                  <Text color="fg.error" fontSize="sm" bg="bg.error" px="4" py="3" rounded="md" w="full">
                    {errorMessage}
                  </Text>
                )}

                <ImageUpload
                  value={product?.image_thumb}
                  onChange={(file) => {
                    setImageFile(file)
                    if (!file) setImageRemoved(true)
                  }}
                />

                <Field.Root invalid={!!errors.name}>
                  <Field.Label>Nama Produk</Field.Label>
                  <Input placeholder="Nama produk" value={form.name} onChange={(e) => set('name', e.target.value)} />
                  <Field.ErrorText>{errors.name}</Field.ErrorText>
                </Field.Root>

                <Grid templateColumns="repeat(2, 1fr)" gap="4" w="full">
                  <Field.Root invalid={!!errors.sku}>
                    <Field.Label>SKU</Field.Label>
                    <Input placeholder="SKU-001" value={form.sku} onChange={(e) => set('sku', e.target.value)} />
                    <Field.ErrorText>{errors.sku}</Field.ErrorText>
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Barcode</Field.Label>
                    <Input placeholder="Opsional" value={form.barcode} onChange={(e) => set('barcode', e.target.value)} />
                  </Field.Root>
                </Grid>

                <Grid templateColumns="repeat(2, 1fr)" gap="4" w="full">
                  <Field.Root invalid={!!errors.category_id}>
                    <Field.Label>Kategori</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field value={form.category_id} onChange={(e) => set('category_id', e.target.value)}>
                        <option value="">Pilih kategori</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    <Field.ErrorText>{errors.category_id}</Field.ErrorText>
                  </Field.Root>
                  <Field.Root invalid={!!errors.unit_id}>
                    <Field.Label>Satuan</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field value={form.unit_id} onChange={(e) => set('unit_id', e.target.value)}>
                        <option value="">Pilih satuan</option>
                        {units.map((u) => (
                          <option key={u.id} value={u.id}>{u.name} ({u.short_code})</option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    <Field.ErrorText>{errors.unit_id}</Field.ErrorText>
                  </Field.Root>
                </Grid>

                <Field.Root>
                  <Field.Label>Deskripsi</Field.Label>
                  <Textarea placeholder="Deskripsi produk (opsional)" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
                </Field.Root>

                <Grid templateColumns="repeat(2, 1fr)" gap="4" w="full">
                  <Field.Root invalid={!!errors.purchase_price}>
                    <Field.Label>Harga Beli (Rp)</Field.Label>
                    <Input type="number" value={form.purchase_price} onChange={(e) => set('purchase_price', e.target.value)} />
                    <Field.ErrorText>{errors.purchase_price}</Field.ErrorText>
                  </Field.Root>
                  <Field.Root invalid={!!errors.selling_price}>
                    <Field.Label>Harga Jual (Rp)</Field.Label>
                    <Input type="number" value={form.selling_price} onChange={(e) => set('selling_price', e.target.value)} />
                    <Field.ErrorText>{errors.selling_price}</Field.ErrorText>
                  </Field.Root>
                </Grid>

                <Grid templateColumns="repeat(2, 1fr)" gap="4" w="full">
                  <Field.Root invalid={!!errors.stock}>
                    <Field.Label>Stok</Field.Label>
                    <Input type="number" value={form.stock} onChange={(e) => set('stock', e.target.value)} />
                    <Field.ErrorText>{errors.stock}</Field.ErrorText>
                  </Field.Root>
                  <Field.Root invalid={!!errors.stock_minimum}>
                    <Field.Label>Stok Minimum</Field.Label>
                    <Input type="number" value={form.stock_minimum} onChange={(e) => set('stock_minimum', e.target.value)} />
                    <Field.ErrorText>{errors.stock_minimum}</Field.ErrorText>
                  </Field.Root>
                </Grid>

                <Checkbox.Root checked={form.is_active} onCheckedChange={(e) => set('is_active', !!e.checked)}>
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label>Produk aktif</Checkbox.Label>
                </Checkbox.Root>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer gap="3">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>Batal</Button>
              <Button onClick={handleSave} loading={isLoading} disabled={isLoading}>
                {isLoading ? 'Menyimpan...' : (product ? 'Simpan Perubahan' : 'Tambah Produk')}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
