import { Button, Card, Field, Input, Text, VStack, Stack, Link as ChakraLink } from '@chakra-ui/react'
import { authApi } from '@/api/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { motion } from 'motion/react'
import { z } from 'zod'
import { useState } from 'react'

const forgotSchema = z.object({
  email: z.string().email('Email tidak valid'),
})

type ForgotForm = z.infer<typeof forgotSchema>

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  const form = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  })

  const mutation = useMutation({
    mutationFn: (data: ForgotForm) => authApi.forgotPassword(data.email),
    onSuccess: () => setSent(true),
  })

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <Card.Root variant="elevated" w="full">
          <Card.Header>
            <Card.Title>Cek Email Anda</Card.Title>
            <Card.Description>
              Jika email terdaftar, Anda akan menerima tautan reset password.
            </Card.Description>
          </Card.Header>
          <Card.Body>
            <Link to="/login">
              <ChakraLink color="colorPalette.600" fontSize="sm">
                Kembali ke halaman masuk
              </ChakraLink>
            </Link>
          </Card.Body>
        </Card.Root>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Card.Root variant="elevated" w="full">
        <Card.Header>
          <Card.Title>Lupa Password</Card.Title>
          <Card.Description>Masukkan email Anda untuk menerima tautan reset password</Card.Description>
        </Card.Header>
        <Card.Body>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))}>
            <VStack gap="4">
              <Field.Root invalid={!!form.formState.errors.email}>
                <Field.Label>Email</Field.Label>
                <Input type="email" placeholder="superadmin@hideo.com" {...form.register('email')} />
                <Field.ErrorText>{form.formState.errors.email?.message}</Field.ErrorText>
              </Field.Root>

              {mutation.isError && (
                <Text color="fg.error" fontSize="sm" bg="bg.error" px="3" py="2" rounded="md" w="full">
                  {mutation.error?.message || 'Terjadi kesalahan'}
                </Text>
              )}

              <Button type="submit" w="full" loading={mutation.isPending} loadingText="Mengirim...">
                Kirim Tautan Reset
              </Button>
            </VStack>
          </form>
          <Stack mt="4" textAlign="center">
            <Link to="/login">
              <ChakraLink color="colorPalette.600" fontSize="sm">
                Kembali ke halaman masuk
              </ChakraLink>
            </Link>
          </Stack>
        </Card.Body>
      </Card.Root>
    </motion.div>
  )
}
