import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Icon,
  Menu,
  Portal,
  Spacer,
  Text,
} from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { LuCode, LuLogOut } from 'react-icons/lu'
import { authClient } from '@/lib/auth-client'
import { ColorModeButton } from '@/integrations/chakra-ui/color-mode'

interface DashboardNavbarProps {
  user: {
    id: string
    name: string
    email: string
    image?: string | null
  } | null
}

export function DashboardNavbar({ user }: DashboardNavbarProps) {
  return (
    <Box borderBottomWidth="1px" borderColor="border.muted" bg="bg">
      <Container maxW="6xl">
        <Flex h="16" align="center">
          <Link to="/">
            <HStack gap="2" userSelect="none">
              <Icon boxSize="6" color="fg">
                <LuCode />
              </Icon>
              <Text fontWeight="bold" fontSize="lg" fontFamily="mono" color="fg">
                Cleanough
              </Text>
            </HStack>
          </Link>
          <Spacer />
          <HStack gap="2">
            <ColorModeButton />
            {user ? (
              <Menu.Root positioning={{ placement: 'bottom-end' }}>
                <Menu.Trigger
                  rounded="full"
                  focusRing="outside"
                  cursor="pointer"
                >
                  <Avatar.Root size="sm">
                    <Avatar.Fallback name={user.name || user.email} />
                    <Avatar.Image src={user.image || undefined} />
                  </Avatar.Root>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content minW="200px">
                      <Box
                        px="3"
                        py="2"
                        borderBottomWidth="1px"
                        borderColor="border.muted"
                      >
                        <Text fontWeight="medium" fontSize="sm">
                          {user.name}
                        </Text>
                        <Text color="fg.muted" fontSize="xs">
                          {user.email}
                        </Text>
                      </Box>
                      <Menu.Item
                        value="logout"
                        color="fg.error"
                        _hover={{ bg: 'bg.error', color: 'fg.error' }}
                        onClick={() => authClient.signOut()}
                      >
                        <Icon>
                          <LuLogOut />
                        </Icon>
                        Sign out
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            ) : (
              <Link to="/login">
                <Button size="sm" variant="solid">
                  Sign in
                </Button>
              </Link>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}
