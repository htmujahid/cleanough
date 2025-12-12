'use client'

import { useState } from 'react'
import { Accordion, Box, Button, HStack, Spinner, Text } from '@chakra-ui/react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEditor } from './editor-context'
import { EditorCommitItem } from './editor-commit-item'
import { fetchCommits } from '@/lib/github'

export function EditorHistory() {
  const { repoData, currentBranch } = useEditor()
  const [expandedCommits, setExpandedCommits] = useState<Array<string>>([])

  const perPage = 30
  const totalPages = Math.ceil(repoData.totalCommits / perPage)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: [
      'commits',
      repoData.repo.owner.login,
      repoData.repo.name,
      currentBranch,
    ],
    queryFn: ({ pageParam }) =>
      fetchCommits({
        data: {
          owner: repoData.repo.owner.login,
          repo: repoData.repo.name,
          branch: currentBranch,
          page: pageParam,
          perPage,
        },
      }),
    // Start from last page (oldest commits)
    initialPageParam: totalPages,
    getNextPageParam: (_, allPages) => {
      // Calculate next page going backwards (towards page 1)
      const currentPage = totalPages - allPages.length + 1
      return currentPage > 1 ? currentPage - 1 : undefined
    },
  })

  if (isLoading) {
    return (
      <Box h="full" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="lg" />
      </Box>
    )
  }

  if (isError) {
    return (
      <Box
        h="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p="4"
      >
        <Text color="fg.error" fontSize="sm">
          Error loading commits:{' '}
          {error instanceof Error ? error.message : 'Unknown error'}
        </Text>
      </Box>
    )
  }

  // Reverse each page's commits and flatten them (oldest to newest overall)
  const allCommits =
    data?.pages.flatMap((page) => [...page.commits].reverse()) || []

  return (
    <Box h="full" overflow="auto">
      <Box px="3" py="2" borderBottomWidth="1px" borderColor="border.muted">
        <Text
          fontSize="xs"
          fontWeight="semibold"
          textTransform="uppercase"
          color="fg.muted"
        >
          Commits (oldest to newest)
        </Text>
      </Box>
      <Accordion.Root
        collapsible
        multiple
        variant="plain"
        value={expandedCommits}
        onValueChange={(e) => setExpandedCommits(e.value)}
      >
        {allCommits.map((commit) => (
          <EditorCommitItem
            key={commit.sha}
            commit={commit}
            isExpanded={expandedCommits.includes(commit.sha)}
          />
        ))}
      </Accordion.Root>
      {hasNextPage && (
        <Box p="3">
          <Button
            width="full"
            size="sm"
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <HStack gap="2">
                <Spinner size="sm" />
                <Text>Loading more...</Text>
              </HStack>
            ) : (
              'Load More'
            )}
          </Button>
        </Box>
      )}
    </Box>
  )
}
