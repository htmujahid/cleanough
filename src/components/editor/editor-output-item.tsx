'use client'

import { Box, Spinner, Text } from '@chakra-ui/react'
import Editor from '@monaco-editor/react'
import { useQuery } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import { useEditor } from './editor-context'
import type { CleanoughMetaItem } from '@/types/github'
import { useColorMode } from '@/integrations/chakra-ui/color-mode'
import { fetchFileContent } from '@/lib/github'

interface EditorOutputItemProps {
  item: CleanoughMetaItem
}

export function EditorOutputItem({ item }: EditorOutputItemProps) {
  const { repoData, currentBranch } = useEditor()
  const { colorMode } = useColorMode()
  const search = useSearch({ from: '/repos/$owner/$repo' })
  const ref = search.commit || currentBranch

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      'output-content',
      repoData.repo.owner.login,
      repoData.repo.name,
      item.path,
      ref,
    ],
    queryFn: () =>
      fetchFileContent({
        data: {
          owner: repoData.repo.owner.login,
          repo: repoData.repo.name,
          path: item.path,
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
          Loading output...
        </Text>
      </Box>
    )
  }

  if (isError || !data) {
    return (
      <Box h="full" display="flex" alignItems="center" justifyContent="center">
        <Text color="fg.error" fontSize="sm">
          Failed to load: {item.path}
        </Text>
      </Box>
    )
  }

  if (item.type === 'image') {
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
            {item.path}
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
            alt={item.path}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>
      </Box>
    )
  }

  if (item.type === 'terminal') {
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
            {item.path}
          </Text>
        </Box>
        <Box flex="1">
          <Editor
            height="100%"
            language="shell"
            value={data.content}
            theme={colorMode === 'dark' ? 'vs-dark' : 'light'}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 13,
              lineNumbers: 'off',
              folding: false,
              wordWrap: 'on',
            }}
          />
        </Box>
      </Box>
    )
  }

  return null
}
