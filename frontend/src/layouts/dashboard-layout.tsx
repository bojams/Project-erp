import { Box, Flex, VStack, Text, Button, Avatar, Spinner, IconButton, useBreakpointValue, Menu, Portal } from '@chakra-ui/react'
import { Outlet, useNavigate, useLocation } from 'react-router'
import { useAuthStore } from '@/stores/auth-store'
import { useEffect, useState } from 'react'
import { LogOut, PackageOpen, LayoutDashboard, Package, ShoppingCart, Truck, Users, BarChart3, Settings, PanelLeftClose } from 'lucide-react'
import { toaster } from '@/lib/toaster'

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Produk', href: '/products', icon: Package },
  { label: 'Penjualan', href: '/sales', icon: ShoppingCart },
  { label: 'Pembelian', href: '/purchases', icon: Truck },
  { label: 'Pelanggan', href: '/customers', icon: Users },
  { label: 'Laporan', href: '/reports', icon: BarChart3 },
  { label: 'Pengaturan', href: '/settings', icon: Settings },
]

export function DashboardLayout() {
  const { user, isAuthenticated, isLoading, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isMobile = useBreakpointValue({ base: true, md: false })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true })
    }
  }, [isLoading, isAuthenticated, navigate])

  const handleLogout = () => {
    logout()
    toaster.success({ title: 'Logout Berhasil', description: 'Sampai jumpa lagi!' })
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile])

  if (isLoading) {
    return (
      <Flex minH="100dvh" align="center" justify="center" bg="bg">
        <Spinner color="colorPalette.600" size="lg" />
      </Flex>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (isMobile) {
    return (
      <Flex minH="100dvh" bg="bg" direction="column">
        <Flex
          as="header"
          position="sticky"
          top="0"
          zIndex="20"
          h="14"
          align="center"
          justify="space-between"
          borderBottom="1px solid"
          borderColor="border"
          bg="bg.panel/80"
          px="4"
          backdropFilter="auto"
          backdropBlur="sm"
        >
          <Flex align="center" gap="2">
            <PackageOpen size={20} />
            <Text fontWeight="bold" fontSize="md" color="fg">Hideo ERP</Text>
          </Flex>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Box cursor="pointer">
                <Avatar.Root size="sm">
                  <Avatar.Fallback bg="colorPalette.subtle" color="colorPalette.fg">
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar.Fallback>
                </Avatar.Root>
              </Box>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content minW="36">
                  <Menu.Item value="settings" onClick={() => navigate('/settings')} gap="2">
                    <Settings size={16} />
                    Pengaturan
                  </Menu.Item>
                  <Menu.Item value="logout" onClick={handleLogout} gap="2" color="fg.error">
                    <LogOut size={16} />
                    Keluar
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Flex>

        <Box as="main" flex="1" pb="16" overflowY="auto">
          <Outlet />
        </Box>

        <Flex
          as="nav"
          position="fixed"
          bottom="0"
          left="0"
          right="0"
          zIndex="30"
          h="14"
          bg="bg.panel"
          borderTop="1px solid"
          borderColor="border"
          align="center"
          justify="space-around"
          px="2"
          css={{
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '100%',
              left: '0',
              right: '0',
              height: 'env(safe-area-inset-bottom, 19px)',
              backgroundColor: 'var(--chakra-colors-bg-panel)',
            }
          }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Flex
                key={item.href}
                as="button"
                onClick={() => navigate(item.href)}
                align="center"
                justify="center"
                flex="1"
                h="full"
                cursor="pointer"
                border="one"
                bg="transparent"
                position="relative"
                outline="none"
              >
                {isActive && (
                  <Box
                    position="absolute"
                    bottom="6"
                    left="50%"
                    transform="translateX(-50%)"
                    w="14"
                    h="16"
                    rounded="2xl"
                    bg="white"
                    shadow="lg"
                    zIndex="0"
                  />
                )}
                <Box
                  position={isActive ? 'absolute' : 'relative'}
                  top={isActive ? '50%' : undefined}
                  left={isActive ? '50%' : undefined}
                  transform={isActive ? 'translate(-50%, -50%)' : undefined}
                  mt={isActive ? '-7' : undefined}
                  zIndex="1"
                  color={isActive ? 'gray.900' : 'gray.400'}
                >
                  <item.icon size={20} />
                </Box>
              </Flex>
            )
          })}
        </Flex>
      </Flex>
    )
  }

  const sidebarWidth = sidebarOpen ? '64' : '16'

  return (
    <Flex minH="100dvh" bg="bg">
      <Box
        as="aside"
        position="fixed"
        insetY="0"
        left="0"
        zIndex="30"
        display="flex"
        flexDirection="column"
        borderRight="1px solid"
        borderColor="border"
        bg="bg.panel"
        transition="width 0.2s"
        w={sidebarWidth}
      >
        <Flex
          h="16"
          align="center"
          borderBottom="1px solid"
          borderColor="border"
          px={sidebarOpen ? '5' : '3'}
          gap={sidebarOpen ? '3' : '0'}
        >
          <IconButton
            aria-label="Toggle sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            variant="plain"
            size="sm"
            w="9"
            h="9"
            rounded="xl"
            bg="linear-gradient(135deg, var(--chakra-colors-color-palette-600), var(--chakra-colors-purple-600))"
            color="white"
            flexShrink="0"
          >
            <PackageOpen size={20} />
          </IconButton>
          {sidebarOpen && (
            <>
              <Text fontWeight="bold" fontSize="md" color="fg" whiteSpace="nowrap">Hideo ERP</Text>
              <IconButton
                aria-label="Close sidebar"
                onClick={() => setSidebarOpen(false)}
                variant="ghost"
                size="xs"
                ml="auto"
                color="fg.subtle"
              >
                <PanelLeftClose size={16} />
              </IconButton>
            </>
          )}
        </Flex>

        <VStack as="nav" flex="1" gap="1" p="3" overflowY="auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Button
                key={item.href}
                variant={isActive ? 'solid' : 'ghost'}
                colorPalette={isActive ? 'colorPalette' : 'gray'}
                w="full"
                justifyContent={sidebarOpen ? 'flex-start' : 'center'}
                px={sidebarOpen ? '3' : '2'}
                gap="3"
                height="10"
                title={sidebarOpen ? undefined : item.label}
                onClick={() => navigate(item.href)}
              >
                <Box as="span" flexShrink="0" display="flex">
                  <item.icon size={20} />
                </Box>
                {sidebarOpen && <Text fontSize="sm" fontWeight="medium">{item.label}</Text>}
              </Button>
            )
          })}
        </VStack>

        <Box borderTop="1px solid" borderColor="border" p="3">
          <Button
            variant="ghost"
            w="full"
            justifyContent={sidebarOpen ? 'flex-start' : 'center'}
            px={sidebarOpen ? '3' : '2'}
            gap="3"
            height="10"
            color="fg.error"
            _hover={{ bg: 'bg.error', color: 'fg.error' }}
            onClick={handleLogout}
            title={sidebarOpen ? undefined : 'Keluar'}
          >
            <LogOut size={16} />
            {sidebarOpen && <Text fontSize="sm" fontWeight="medium">Keluar</Text>}
          </Button>
        </Box>
      </Box>

      <Box
        flex="1"
        ml={sidebarWidth}
        transition="margin-left 0.2s"
        display="flex"
        flexDirection="column"
        minW="0"
      >
        <Flex
          as="header"
          position="sticky"
          top="0"
          zIndex="20"
          h="16"
          align="center"
          justify="space-between"
          borderBottom="1px solid"
          borderColor="border"
          bg="bg.panel/80"
          px="6"
          backdropFilter="auto"
          backdropBlur="sm"
        >
          <Text fontWeight="semibold" fontSize="md" color="fg">
            {navItems.find((i) => i.href === location.pathname)?.label || 'Dashboard'}
          </Text>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Flex align="center" gap="3" cursor="pointer">
                <Avatar.Root size="sm">
                  <Avatar.Fallback bg="colorPalette.subtle" color="colorPalette.fg">
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar.Fallback>
                </Avatar.Root>
                <Text fontSize="sm" fontWeight="medium" color="fg" display={{ base: 'none', md: 'block' }}>
                  {user?.name}
                </Text>
              </Flex>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content minW="36">
                  <Menu.Item value="settings" onClick={() => navigate('/settings')} gap="2">
                    <Settings size={16} />
                    Pengaturan
                  </Menu.Item>
                  <Menu.Item value="logout" onClick={handleLogout} gap="2" color="fg.error">
                    <LogOut size={16} />
                    Keluar
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Flex>
        <Box as="main" flex="1" p="6">
          <Outlet />
        </Box>
      </Box>
    </Flex>
  )
}
