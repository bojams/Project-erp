import { useState, useEffect, type FC } from 'react'
import {
  Box, Card, Flex, Grid, Heading, Text, Button, Input, Textarea, VStack, HStack, Field, Switch,
  IconButton, Avatar, Badge,
} from '@chakra-ui/react'
import {
  Building2, Palette, Bell, Shield, Users, ChevronRight, ChevronLeft, Sun, Moon, Monitor, Save, UserPlus,
  Eye, EyeOff, Check,
} from 'lucide-react'
import { motion } from 'motion/react'

type SectionId = 'company' | 'appearance' | 'notifications' | 'security' | 'team'

const sections: { id: SectionId; label: string; icon: typeof Building2; desc: string; palette: string }[] = [
  { id: 'company', label: 'Perusahaan', icon: Building2, desc: 'Profil dan informasi perusahaan', palette: 'blue' },
  { id: 'appearance', label: 'Tampilan', icon: Palette, desc: 'Tema, bahasa, dan preferensi', palette: 'purple' },
  { id: 'notifications', label: 'Notifikasi', icon: Bell, desc: 'Pengaturan notifikasi dan email', palette: 'orange' },
  { id: 'security', label: 'Keamanan', icon: Shield, desc: 'Password, sesi, dan keamanan akun', palette: 'red' },
  { id: 'team', label: 'Tim', icon: Users, desc: 'Kelola pengguna, peran, dan izin', palette: 'green' },
]

function CompanyForm() {
  const [saved, setSaved] = useState(false)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap="5" align="stretch">
        <Flex align="center" gap="4" direction={{ base: 'column', sm: 'row' }}>
          <Avatar.Root size="xl">
            <Avatar.Fallback bg="blue.subtle" color="blue.fg">
              <Building2 size={28} />
            </Avatar.Fallback>
          </Avatar.Root>
          <Button variant="outline" size="sm">Ganti Logo</Button>
        </Flex>
        <Grid gap="4" templateColumns={{ base: '1fr', sm: '1fr 1fr' }}>
          <Field.Root required>
            <Field.Label>Nama Perusahaan</Field.Label>
            <Input defaultValue="Hideo Store" placeholder="Nama perusahaan" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Email</Field.Label>
            <Input type="email" defaultValue="info@hideo.store" placeholder="Email perusahaan" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Telepon</Field.Label>
            <Input type="tel" defaultValue="+62 812-3456-7890" placeholder="Nomor telepon" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Website</Field.Label>
            <Input defaultValue="https://hideo.store" placeholder="Website" />
          </Field.Root>
        </Grid>
        <Field.Root>
          <Field.Label>Alamat</Field.Label>
          <Textarea defaultValue="Jl. Merdeka No. 123, Jakarta Pusat" placeholder="Alamat lengkap" rows={3} />
        </Field.Root>
        <Button type="submit" alignSelf="flex-start">
          {saved ? <><Check size={16} /> Tersimpan</> : <><Save size={16} /> Simpan</>}
        </Button>
      </VStack>
    </form>
  )
}

function AppearanceForm() {
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>(() => {
    if (typeof localStorage !== 'undefined') {
      return (localStorage.getItem('theme-mode') as 'light' | 'dark' | 'system') || 'system'
    }
    return 'system'
  })

  useEffect(() => {
    localStorage.setItem('theme-mode', mode)

    if (mode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const apply = () => {
        document.documentElement.classList.toggle('dark', mq.matches)
      }
      apply()
      mq.addEventListener('change', apply)
      return () => mq.removeEventListener('change', apply)
    }

    document.documentElement.classList.toggle('dark', mode === 'dark')
  }, [mode])

  const helperText = {
    light: 'Tampilan selalu terang',
    dark: 'Tampilan selalu gelap',
    system: 'Mengikuti tema perangkat Anda saat ini',
  }

  return (
    <VStack gap="6" align="stretch">
      <Field.Root>
        <Field.Label>Tema Aplikasi</Field.Label>
                        <Grid gap="3" templateColumns={{ base: 'repeat(3, 1fr)', sm: 'repeat(3, 1fr)' }}>
          <Button
            variant={mode === 'light' ? 'solid' : 'outline'}
            colorPalette={mode === 'light' ? 'blue' : 'gray'}
            onClick={() => setMode('light')}
            flexDirection="column"
            gap="1.5"
            h="auto"
            py="4"
          >
            <Sun size={20} />
            <Text fontSize="xs" fontWeight="medium">Terang</Text>
          </Button>
          <Button
            variant={mode === 'dark' ? 'solid' : 'outline'}
            colorPalette={mode === 'dark' ? 'purple' : 'gray'}
            onClick={() => setMode('dark')}
            flexDirection="column"
            gap="1.5"
            h="auto"
            py="4"
          >
            <Moon size={20} />
            <Text fontSize="xs" fontWeight="medium">Gelap</Text>
          </Button>
          <Button
            variant={mode === 'system' ? 'solid' : 'outline'}
            colorPalette={mode === 'system' ? 'green' : 'gray'}
            onClick={() => setMode('system')}
            flexDirection="column"
            gap="1.5"
            h="auto"
            py="4"
          >
            <Monitor size={20} />
            <Text fontSize="xs" fontWeight="medium">Sistem</Text>
          </Button>
        </Grid>
        <Field.HelperText>{helperText[mode]}</Field.HelperText>
      </Field.Root>

      <Field.Root>
        <Field.Label>Bahasa</Field.Label>
        <HStack gap="3">
          <Button variant="solid" colorPalette="blue" flex="1">Indonesia</Button>
          <Button variant="outline" disabled flex="1">English</Button>
        </HStack>
        <Field.HelperText>Bahasa Indonesia adalah bahasa default</Field.HelperText>
      </Field.Root>
    </VStack>
  )
}

function NotificationsForm() {
  const [settings, setSettings] = useState({
    emailSales: true,
    emailStock: false,
    inAppSales: true,
    inAppStock: true,
    emailPurchase: false,
  })

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const items = [
    { key: 'inAppSales' as const, label: 'Notifikasi Penjualan', desc: 'Terima notifikasi saat ada transaksi penjualan baru', type: 'In-App' },
    { key: 'inAppStock' as const, label: 'Notifikasi Stok Menipis', desc: 'Peringatan saat stok produk mendekati batas minimum', type: 'In-App' },
    { key: 'emailSales' as const, label: 'Email Penjualan', desc: 'Ringkasan penjualan harian melalui email', type: 'Email' },
    { key: 'emailStock' as const, label: 'Email Stok Menipis', desc: 'Peringatan stok menipis melalui email', type: 'Email' },
    { key: 'emailPurchase' as const, label: 'Email Pembelian', desc: 'Notifikasi status pembelian melalui email', type: 'Email' },
  ]

  return (
    <VStack gap="5" align="stretch">
      {items.map((item) => (
        <Flex
          key={item.key}
          align="center"
          justify="space-between"
          gap="4"
          p="4"
          rounded="lg"
          borderWidth="1px"
          borderColor="border"
        >
          <Box minW="0" flex="1">
            <Flex align="center" gap="2">
              <Text fontWeight="medium" fontSize="sm" color="fg">{item.label}</Text>
              <Badge colorPalette={item.type === 'Email' ? 'blue' : 'green'} size="sm">{item.type}</Badge>
            </Flex>
            <Text fontSize="xs" color="fg.muted" mt="0.5">{item.desc}</Text>
          </Box>
          <Switch.Root
            checked={settings[item.key]}
            onCheckedChange={() => toggle(item.key)}
            colorPalette="blue"
          >
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.HiddenInput />
          </Switch.Root>
        </Flex>
      ))}
    </VStack>
  )
}

function SecurityForm() {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap="5" align="stretch">
        <Text fontWeight="semibold" fontSize="sm" color="fg">Ubah Password</Text>
        <Field.Root required>
          <Field.Label>Password Saat Ini</Field.Label>
          <Box position="relative">
            <Input
              type={showCurrent ? 'text' : 'password'}
              placeholder="Masukkan password saat ini"
              pr="10"
            />
            <IconButton
              aria-label={showCurrent ? 'Sembunyikan' : 'Tampilkan'}
              variant="plain"
              size="xs"
              position="absolute"
              right="1"
              top="50%"
              transform="translateY(-50%)"
              color="fg.subtle"
              onClick={() => setShowCurrent(!showCurrent)}
            >
              {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
            </IconButton>
          </Box>
        </Field.Root>
        <Grid gap="4" templateColumns={{ base: '1fr', sm: '1fr 1fr' }}>
          <Field.Root required>
            <Field.Label>Password Baru</Field.Label>
            <Box position="relative">
              <Input
                type={showNew ? 'text' : 'password'}
                placeholder="Min. 8 karakter"
                pr="10"
              />
              <IconButton
                aria-label={showNew ? 'Sembunyikan' : 'Tampilkan'}
                variant="plain"
                size="xs"
                position="absolute"
                right="1"
                top="50%"
                transform="translateY(-50%)"
                color="fg.subtle"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </IconButton>
            </Box>
          </Field.Root>
          <Field.Root required>
            <Field.Label>Konfirmasi Password</Field.Label>
            <Box position="relative">
              <Input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Ulangi password baru"
                pr="10"
              />
              <IconButton
                aria-label={showConfirm ? 'Sembunyikan' : 'Tampilkan'}
                variant="plain"
                size="xs"
                position="absolute"
                right="1"
                top="50%"
                transform="translateY(-50%)"
                color="fg.subtle"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </IconButton>
            </Box>
          </Field.Root>
        </Grid>
        <Button type="submit" alignSelf="flex-start">
          {saved ? <><Check size={16} /> Tersimpan</> : <><Save size={16} /> Simpan Password</>}
        </Button>
      </VStack>
    </form>
  )
}

function TeamView() {
  return (
    <VStack gap="5" align="stretch">
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        align="center"
        justify="center"
        gap="4"
        p="10"
        rounded="xl"
        borderWidth="1px"
        borderColor="border"
        borderStyle="dashed"
        textAlign="center"
      >
        <Box as={Users} boxSize="12" color="fg.subtle" />
        <Box>
          <Text fontWeight="medium" color="fg">Belum ada anggota tim</Text>
          <Text fontSize="sm" color="fg.muted" mt="1">
            Undang anggota tim untuk bekerja sama dalam mengelola bisnis
          </Text>
          <Button mt="4" size="sm">
            <UserPlus size={16} />
            Undang Anggota
          </Button>
        </Box>
      </Flex>
    </VStack>
  )
}

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null)

  const activeData = activeSection ? sections.find((s) => s.id === activeSection) : null

  const sectionComponents: Record<SectionId, FC> = {
    company: CompanyForm,
    appearance: AppearanceForm,
    notifications: NotificationsForm,
    security: SecurityForm,
    team: TeamView,
  }

  if (activeSection && activeData) {
    const SectionComponent = sectionComponents[activeSection]
    const Icon = activeData.icon

    return (
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <VStack gap="6" align="stretch">
          <Flex align="center" gap="3">
            <IconButton
              aria-label="Kembali"
              variant="ghost"
              onClick={() => setActiveSection(null)}
            >
              <ChevronLeft size={20} />
            </IconButton>
            <Flex w="10" h="10" align="center" justify="center" rounded="xl" bg="colorPalette.subtle" color="colorPalette.fg">
              <Icon size={20} />
            </Flex>
            <Box>
              <Heading size="lg" fontWeight="bold" letterSpacing="tight">{activeData.label}</Heading>
              <Text color="fg.muted" fontSize="sm">{activeData.desc}</Text>
            </Box>
          </Flex>

          <Card.Root variant="elevated">
            <Card.Body p={{ base: '4', md: '6' }}>
              <SectionComponent />
            </Card.Body>
          </Card.Root>
        </VStack>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Box>
        <Flex align="center" gap="3" mb="1">
          <Flex w="10" h="10" align="center" justify="center" rounded="xl" bg="gray.subtle" color="gray.fg">
            <Shield size={20} />
          </Flex>
          <Box>
            <Heading size="lg" fontWeight="bold" letterSpacing="tight">Pengaturan</Heading>
            <Text color="fg.muted" fontSize="sm">Atur preferensi aplikasi Anda</Text>
          </Box>
        </Flex>
        <Grid mt="6" gap="3" templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}>
          {sections.map((item) => {
            const Icon = item.icon
            return (
              <Card.Root
                key={item.id}
                variant="elevated"
                colorPalette={item.palette}
                cursor="pointer"
                transition="all 0.15s"
                _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                onClick={() => setActiveSection(item.id)}
              >
                <Card.Body p="5">
                  <Flex align="center" gap="4">
                    <Flex w="11" h="11" align="center" justify="center" rounded="xl" bg="colorPalette.subtle" color="colorPalette.fg" flexShrink="0">
                      <Icon size={22} />
                    </Flex>
                    <Box flex="1" minW="0">
                      <Text fontWeight="semibold" color="fg">{item.label}</Text>
                      <Text fontSize="xs" color="fg.muted" mt="0.5">{item.desc}</Text>
                    </Box>
                    <Box as={ChevronRight} boxSize="4.5" color="fg.subtle" flexShrink="0" />
                  </Flex>
                </Card.Body>
              </Card.Root>
            )
          })}
        </Grid>
      </Box>
    </motion.div>
  )
}
