import { Box, Container, Heading, SimpleGrid, Text } from '@chakra-ui/react'
import { RepoCard } from './repo-card'

interface Repo {
  owner: string
  repo: string
  description: string
}

interface ReposListProps {
  repos: Array<Repo>
}

export function ReposList({ repos }: ReposListProps) {
  return (
    <Container maxW="4xl" py="12">
      <Box mb="8">
        <Heading size="2xl" mb="2">
          Repositories
        </Heading>
        <Text color="fg.muted">
          Browse repositories to view their git history and detailed
          information. Navigate to{' '}
          <Text as="span" fontFamily="mono" bg="bg.muted" px="1" rounded="sm">
            /repos/[owner]/[repo]
          </Text>{' '}
          to explore commits, file changes, and more.
        </Text>
      </Box>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
        {repos.map(({ owner, repo, description }) => (
          <RepoCard
            key={`${owner}/${repo}`}
            owner={owner}
            repo={repo}
            description={description}
          />
        ))}
      </SimpleGrid>
    </Container>
  )
}
