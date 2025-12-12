import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Icon,
  Spacer,
  Text,
} from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { LuCode } from 'react-icons/lu'
import { ColorModeButton } from '@/integrations/chakra-ui/color-mode'

interface LandingNavbarProps {
  user: {
    id: string
    name: string
    email: string
    image?: string | null
  } | null
}

export function LandingNavbar({ user }: LandingNavbarProps) {
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="sticky"
      bg="bg/80"
      backdropFilter="blur(10px)"
      borderBottomWidth="1px"
      borderColor="border.muted"
    >
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
              <Link to="/repos">
                <Button size="sm" variant="solid">
                  Dashboard
                </Button>
              </Link>
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
