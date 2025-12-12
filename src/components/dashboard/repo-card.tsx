import { Card, HStack, Icon, Text } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { LuFolder, LuGitBranch } from 'react-icons/lu'

interface RepoCardProps {
  owner: string
  repo: string
  description: string
}

export function RepoCard({ owner, repo, description }: RepoCardProps) {
  return (
    <Link to="/repos/$owner/$repo" params={{ owner, repo }}>
      <Card.Root
        variant="outline"
        _hover={{ borderColor: 'border.emphasized', bg: 'bg.muted' }}
        transition="all 0.2s"
        cursor="pointer"
      >
        <Card.Body>
          <HStack gap="3" mb="2">
            <Icon color="fg.muted">
              <LuFolder />
            </Icon>
            <Text fontWeight="semibold" color="fg">
              {owner}/{repo}
            </Text>
          </HStack>
          <Text color="fg.muted" fontSize="sm" mb="2">
            {description}
          </Text>
          <HStack gap="2" color="fg.muted" fontSize="sm">
            <Icon boxSize="3.5">
              <LuGitBranch />
            </Icon>
            <Text>main</Text>
          </HStack>
        </Card.Body>
      </Card.Root>
    </Link>
  )
}
