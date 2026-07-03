import { Button, Card, Field, Input, Text, VStack, Stack, Link as ChakraLink } from '@chakra-ui/react'
import { Link, useSearchParams, useNavigate } from 'react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { motion } from 'motion/react'
import { z } from 'zod'
import { authApi } from '@/api/client'
import { PasswordInput } from '@/components/ui/password-input'

const resetSchema = z
  .object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(8, 'Password minimal 8 karakter'),
    password_confirmation: z.string(),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: 'Konfirmasi password tidak cocok',
    path: ['password_confirmation'],
  })

type ResetForm = z.infer<typeof resetSchema>

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''

  const form = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: '', password: '', password_confirmation: '' },
  })

  const mutation = useMutation({
    mutationFn: (data: ResetForm) =>
      authApi.resetPassword(token, data.email, data.password, data.password_confirmation),
    onSuccess: () => {
      navigate('/login', { replace: true })
    },
  })

  const { errors } = form.formState

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Card.Root variant="elevated" w="full">
        <Card.Header>
          <Card.Title>Reset Password</Card.Title>
          <Card.Description>Masukkan password baru Anda</Card.Description>
        </Card.Header>
        <Card.Body>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))}>
            <VStack gap="4">
              <Field.Root invalid={!!errors.email}>
                <Field.Label>Email</Field.Label>
                <Input type="email" {...form.register('email')} />
                <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.password}>
                <Field.Label>Password Baru</Field.Label>
                <PasswordInput {...form.register('password')} />
                <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.password_confirmation}>
                <Field.Label>Konfirmasi Password</Field.Label>
                <PasswordInput {...form.register('password_confirmation')} />
                <Field.ErrorText>{errors.password_confirmation?.message}</Field.ErrorText>
              </Field.Root>

              {mutation.isError && (
                <Text color="fg.error" fontSize="sm" bg="bg.error" px="3" py="2" rounded="md" w="full">
                  {mutation.error?.message || 'Terjadi kesalahan'}
                </Text>
              )}

              <Button type="submit" w="full" loading={mutation.isPending} loadingText="Memproses...">
                Reset Password
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
