import { useRef, useState } from 'react'
import { Box, Text, VStack, Button, Field } from '@chakra-ui/react'
import { X, Upload } from 'lucide-react'

interface ImageUploadProps {
  value?: string | null
  onChange: (file: File | null) => void
  error?: string
}

export function ImageUpload({ value, onChange, error }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const currentSrc = preview || value

  const handleFile = (file: File | null) => {
    if (preview) URL.revokeObjectURL(preview)
    if (file) {
      setPreview(URL.createObjectURL(file))
    } else {
      setPreview(null)
    }
    onChange(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file?.type.startsWith('image/')) handleFile(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <Field.Root invalid={!!error}>
      <Field.Label>Gambar Produk</Field.Label>
      <Box
        position="relative"
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        cursor="pointer"
        border="2px dashed"
        borderColor={dragOver ? 'colorPalette.400' : currentSrc ? 'transparent' : 'border'}
        bg={dragOver ? 'colorPalette.subtle' : undefined}
        rounded="lg"
        p="6"
        textAlign="center"
        transition="colors"
        _hover={!currentSrc ? { borderColor: 'colorPalette.400' } : undefined}
      >
        {currentSrc ? (
          <>
            <img
              src={currentSrc}
              alt="Preview"
              style={{ maxHeight: '160px', margin: '0 auto', borderRadius: '8px', objectFit: 'contain' }}
            />
            <Button
              type="button"
              position="absolute"
              top="-2"
              right="-2"
              size="xs"
              rounded="full"
              colorPalette="red"
              shadow="md"
              onClick={(e) => { e.stopPropagation(); handleFile(null) }}
            >
              <X size={12} />
            </Button>
          </>
        ) : (
          <VStack gap="2" color="fg.subtle">
            <Upload size={32} />
            <Text fontSize="sm" fontWeight="medium">Klik atau drag gambar ke sini</Text>
            <Text fontSize="xs">JPG, PNG, WEBP maks. 2MB</Text>
          </VStack>
        )}
      </Box>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      <Field.ErrorText>{error}</Field.ErrorText>
    </Field.Root>
  )
}
