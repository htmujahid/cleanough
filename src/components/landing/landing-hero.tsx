import {
  Box,
  Button,
  Container,
  HStack,
  Heading,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { LuExternalLink, LuGitBranch, LuGithub } from 'react-icons/lu'

interface LandingHeroProps {
  user: {
    id: string
    name: string
    email: string
    image?: string | null
  } | null
}

export function LandingHero({ user }: LandingHeroProps) {
  return (
    <Box pt="32" pb="20">
      <Container maxW="4xl" textAlign="center">
        <VStack gap="6">
          <HStack
            gap="2"
            bg="bg.muted"
            px="4"
            py="2"
            rounded="full"
            borderWidth="1px"
            borderColor="border.muted"
          >
            <Icon boxSize="4" color="fg.muted">
              <LuGitBranch />
            </Icon>
            <Text fontSize="sm" color="fg.muted">
              Open Source & Git-powered
            </Text>
          </HStack>

          <Heading
            size="6xl"
            fontWeight="bold"
            lineHeight="1.1"
            letterSpacing="tight"
          >
            Present your code,
            <br />
            <Text as="span" color="fg.muted">
              commit by commit
            </Text>
          </Heading>

          <Text fontSize="xl" color="fg.muted" maxW="2xl">
            Transform any GitHub repository into an interactive presentation.
            Browse code, step through commits, and showcase outputs — all in a
            beautiful VS Code-like interface.
          </Text>

          <HStack gap="4" pt="4">
            {user ? (
              <Link to="/repos">
                <Button size="xl" variant="solid">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="xl" variant="solid">
                  <Icon>
                    <LuGithub />
                  </Icon>
                  Get Started
                </Button>
              </Link>
            )}
            <Button size="xl" variant="outline" asChild>
              <a
                href="https://github.com/htmujahid/cleanough"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon>
                  <LuExternalLink />
                </Icon>
                GitHub
              </a>
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  )
}
