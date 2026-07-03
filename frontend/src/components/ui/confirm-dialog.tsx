import { Button, Dialog, Portal, Text, VStack } from '@chakra-ui/react'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  isLoading?: boolean
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, isLoading }: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(e) => { if (!e.open) onClose() }} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Body>
              <VStack gap="4" textAlign="center" py="4">
                <AlertTriangle size={40} />
                <Dialog.Title>{title}</Dialog.Title>
                <Text fontSize="sm" color="fg.muted">
                  {message}
                </Text>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer gap="3">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Batal
              </Button>
              <Button colorPalette="red" onClick={onConfirm} loading={isLoading}>
                {isLoading ? 'Menghapus...' : 'Hapus'}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
