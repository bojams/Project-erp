import { Button, Card, Field, Input, Text, VStack, Stack } from '@chakra-ui/react'
import { apiClient } from '@/api/client'
import { useAuthStore } from '@/stores/auth-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { ArrowRight, AlertCircle } from 'lucide-react'
import { motion } from 'motion/react'
import { PasswordInput } from '@/components/ui/password-input'
import { toaster } from '@/lib/toaster'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password harus diisi'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const loginMutation = useMutation({
    mutationFn: (data: LoginForm) =>
      apiClient.post('/auth/login', data).then((r) => r.data.data),
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      toaster.success({ title: 'Login Berhasil', description: `Selamat datang kembali, ${data.user.name}!` })
      navigate('/', { replace: true })
    },
  })

  const { errors } = form.formState

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card.Root variant="elevated" w="full">
        <Card.Body p={{ base: '5', sm: '8' }}>
          <VStack gap="6" align="stretch">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
            >
              <Text
                color="fg.muted"
                fontSize="xs"
                fontWeight="semibold"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                Masuk
              </Text>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
            >
              <Text fontSize="2xl" fontWeight="bold" letterSpacing="tight" color="fg">
                Selamat Datang
              </Text>
              <Text color="fg.muted" fontSize="sm" mt="1">
                Silakan masukkan kredensial akun Anda
              </Text>
            </motion.div>

            <form onSubmit={form.handleSubmit((data) => loginMutation.mutate(data))}>
              <VStack gap="5" align="stretch">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.16 }}
                >
                  <Field.Root invalid={!!errors.email}>
                    <Field.Label fontSize="sm" fontWeight="medium">
                      Email
                    </Field.Label>
                    <Input
                      type="email"
                      placeholder="superadmin@hideo.com"
                      autoComplete="email"
                      {...form.register('email')}
                    />
                    <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                  </Field.Root>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.22 }}
                >
                  <Field.Root invalid={!!errors.password}>
                    <Field.Label fontSize="sm" fontWeight="medium">
                      Password
                    </Field.Label>
                    <PasswordInput
                      placeholder="Masukkan password"
                      autoComplete="current-password"
                      {...form.register('password')}
                    />
                    <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                  </Field.Root>
                </motion.div>

                {loginMutation.isError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <Stack
                      direction="row"
                      gap="2"
                      align="center"
                      bg="bg.error"
                      color="fg.error"
                      px="3"
                      py="2.5"
                      rounded="lg"
                      fontSize="sm"
                    >
                      <AlertCircle size={16} style={{ flexShrink: 0 }} />
                      <Text>{loginMutation.error?.message || 'Login gagal. Silakan coba lagi.'}</Text>
                    </Stack>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.28 }}
                >
                  <Button
                    type="submit"
                    w="full"
                    size="lg"
                    loading={loginMutation.isPending}
                    loadingText="Memproses..."
                    bg="linear-gradient(135deg, var(--chakra-colors-color-palette-600), var(--chakra-colors-purple-600))"
                    color="white"
                    border="none"
                    _hover={{ opacity: 0.92, transform: 'translateY(-1px)' }}
                    _active={{ transform: 'translateY(0)' }}
                  >
                    Masuk
                    <ArrowRight size={16} />
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.35 }}
                >
                  <Text textAlign="center">
                    <Link to="/forgot-password">
                      <Text
                        as="span"
                        color="colorPalette.600"
                        fontSize="sm"
                        fontWeight="medium"
                        _hover={{ color: 'colorPalette.500', textDecoration: 'underline' }}
                      >
                        Lupa password?
                      </Text>
                    </Link>
                  </Text>
                </motion.div>
              </VStack>
            </form>
          </VStack>
        </Card.Body>
      </Card.Root>
    </motion.div>
  )
}
