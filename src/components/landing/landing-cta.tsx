import {
  Box,
  Button,
  Container,
  Heading,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { LuGithub } from 'react-icons/lu'

interface LandingCTAProps {
  user: {
    id: string
    name: string
    email: string
    image?: string | null
  } | null
}

export function LandingCTA({ user }: LandingCTAProps) {
  return (
    <Box py="20" bg="bg.muted">
      <Container maxW="3xl" textAlign="center">
        <VStack gap="6">
          <Heading size="2xl">Ready to present your code?</Heading>
          <Text color="fg.muted" fontSize="lg">
            Connect your GitHub account and start creating beautiful code
            presentations in minutes.
          </Text>
          {user ? (
            <Link to="/repos">
              <Button size="xl" variant="solid">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button size="xl" variant="solid">
                <Icon>
                  <LuGithub />
                </Icon>
                Sign in with GitHub
              </Button>
            </Link>
          )}
        </VStack>
      </Container>
    </Box>
  )
}
