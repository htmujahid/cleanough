'use client'

import { Box, Icon, Spinner, Text } from '@chakra-ui/react'
import { LuFileAudio, LuFileQuestion } from 'react-icons/lu'
import Editor from '@monaco-editor/react'
import { useQuery } from '@tanstack/react-query'
import { useEditor } from './editor-context'
import type { Monaco } from '@monaco-editor/react'
import type { EditorTab } from './editor-tabs'
import { useColorMode } from '@/integrations/chakra-ui/color-mode'
import { fetchFileContent } from '@/lib/github'
import { getFileTypeInfo } from '@/lib/file-utils'

interface EditorContentProps {
  tab: EditorTab
}

export function EditorContent({ tab }: EditorContentProps) {
  const { repoData, currentBranch } = useEditor()
  const { colorMode } = useColorMode()

  const {
    data: fileData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      'file-content',
      repoData.repo.owner.login,
      repoData.repo.name,
      tab.path,
      tab.ref,
    ],
    queryFn: () =>
      fetchFileContent({
        data: {
          owner: repoData.repo.owner.login,
          repo: repoData.repo.name,
          path: tab.path,
          ref: tab.ref || currentBranch,
        },
      }),
  })

  const handleBeforeMount = (monaco: Monaco) => {
    // Configure TypeScript compiler options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.React,
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      strict: true,
      skipLibCheck: true,
    })
  }

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
        <Text color="fg.muted">Loading file...</Text>
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
          Error loading file:{' '}
          {error instanceof Error ? error.message : 'Unknown error'}
        </Text>
      </Box>
    )
  }

  if (!fileData) {
    return (
      <Box
        h="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p="4"
      >
        <Text color="fg.muted" fontSize="sm">
          No file data available
        </Text>
      </Box>
    )
  }

  const fileTypeInfo = getFileTypeInfo(fileData.path)

  // Render based on file category
  if (fileTypeInfo.category === 'image') {
    return (
      <Box
        h="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="bg.subtle"
        overflow="auto"
        p="4"
      >
        <img
          src={fileData.download_url || ''}
          alt={fileData.name}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        />
      </Box>
    )
  }

  if (fileTypeInfo.category === 'audio') {
    return (
      <Box
        h="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        gap="4"
        bg="bg.subtle"
      >
        <Icon boxSize="16" color="fg.muted">
          <LuFileAudio />
        </Icon>
        <Text color="fg.muted" fontSize="sm" mb="4">
          {fileData.name}
        </Text>
        <audio controls src={fileData.download_url || ''}>
          Your browser does not support the audio element.
        </audio>
      </Box>
    )
  }

  if (fileTypeInfo.category === 'video') {
    return (
      <Box
        h="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="bg.subtle"
        p="4"
      >
        <video
          controls
          style={{ maxWidth: '100%', maxHeight: '100%' }}
          src={fileData.download_url || ''}
        >
          Your browser does not support the video element.
        </video>
      </Box>
    )
  }

  if (fileTypeInfo.category === 'unsupported') {
    return (
      <Box
        h="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        gap="4"
        color="fg.muted"
      >
        <Icon boxSize="12">
          <LuFileQuestion />
        </Icon>
        <Text fontSize="lg" fontWeight="medium">
          Preview not available
        </Text>
        <Text fontSize="sm">This file type is not supported for preview</Text>
      </Box>
    )
  }

  // Default: text file - use Monaco editor
  return (
    <Editor
      height="100%"
      language={fileTypeInfo.monacoLanguage || 'plaintext'}
      value={fileData.content}
      theme={colorMode === 'dark' ? 'vs-dark' : 'light'}
      beforeMount={handleBeforeMount}
      options={{
        readOnly: true,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineNumbers: 'on',
        renderWhitespace: 'selection',
        tabSize: 2,
      }}
    />
  )
}
