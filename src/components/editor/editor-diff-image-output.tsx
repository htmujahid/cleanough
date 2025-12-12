'use client'

import { Box, Spinner, Text } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useEditor } from './editor-context'
import { fetchFileContent } from '@/lib/github'

interface EditorDiffImageOutputProps {
  path: string
  ref: string
}

export function EditorDiffImageOutput({
  path,
  ref,
}: EditorDiffImageOutputProps) {
  const { repoData } = useEditor()

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      'output-content',
      repoData.repo.owner.login,
      repoData.repo.name,
      path,
      ref,
    ],
    queryFn: () =>
      fetchFileContent({
        data: {
          owner: repoData.repo.owner.login,
          repo: repoData.repo.name,
          path,
          ref,
        },
      }),
  })

  if (isLoading) {
    return (
      <Box
        h="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        gap="4"
      >
        <Spinner size="lg" />
        <Text color="fg.muted" fontSize="sm">
          Loading image...
        </Text>
      </Box>
    )
  }

  if (isError || !data) {
    return (
      <Box h="full" display="flex" alignItems="center" justifyContent="center">
        <Text color="fg.error" fontSize="sm">
          Failed to load: {path}
        </Text>
      </Box>
    )
  }

  return (
    <Box h="full" display="flex" flexDirection="column" overflow="hidden">
      <Box
        px="3"
        py="2"
        borderBottomWidth="1px"
        borderColor="border.muted"
        flexShrink={0}
      >
        <Text
          fontSize="xs"
          fontWeight="medium"
          fontFamily="mono"
          color="fg.muted"
        >
          {path}
        </Text>
      </Box>
      <Box
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="bg.subtle"
        p="4"
      >
        <img
          src={data.download_url || ''}
          alt={path}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        />
      </Box>
    </Box>
  )
}
