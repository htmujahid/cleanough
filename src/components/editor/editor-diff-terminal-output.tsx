'use client'

import { Box, Spinner, Text } from '@chakra-ui/react'
import Editor from '@monaco-editor/react'
import { useQuery } from '@tanstack/react-query'
import { useEditor } from './editor-context'
import { useColorMode } from '@/integrations/chakra-ui/color-mode'
import { fetchFileContent } from '@/lib/github'

interface EditorDiffTerminalOutputProps {
  path: string
  ref: string
}

export function EditorDiffTerminalOutput({
  path,
  ref,
}: EditorDiffTerminalOutputProps) {
  const { repoData } = useEditor()
  const { colorMode } = useColorMode()

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
          Loading terminal output...
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
