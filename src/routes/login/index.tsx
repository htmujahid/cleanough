import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import {
  Button,
  Card,
  Center,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useTransition } from 'react'
import { LuCode, LuGithub } from 'react-icons/lu'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/login/')({
  beforeLoad: ({ context }) => {
    if (context.session) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const [isPending, startTransition] = useTransition()

  const handleGitHubLogin = () => {
    startTransition(async () => {
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/repos',
      })
    })
  }

  return (
    <Center minH="100vh">
      <Card.Root width="360px" variant="elevated">
        <Card.Header>
          <VStack gap="3">
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
            <Text color="fg.muted" textStyle="sm">
              Sign in to continue
            </Text>
          </VStack>
        </Card.Header>
        <Card.Body>
          <Button
            width="full"
            size="lg"
            onClick={handleGitHubLogin}
            loading={isPending}
            loadingText="Signing in..."
          >
            <Icon size="md">
              <LuGithub />
            </Icon>
            Continue with GitHub
          </Button>
        </Card.Body>
      </Card.Root>
    </Center>
  )
}
