'use client'

import { Box, Spinner, Text } from '@chakra-ui/react'
import { DiffEditor } from '@monaco-editor/react'
import { useQuery } from '@tanstack/react-query'
import { useEditor } from './editor-context'
import { EditorBreadcrumb } from './editor-breadcrumb'
import { useColorMode } from '@/integrations/chakra-ui/color-mode'
import { fetchFileCommits, fetchFileContent } from '@/lib/github'
import { getFileTypeInfo, isTextFile } from '@/lib/file-utils'

interface EditorDiffFileDiffProps {
  path: string
  ref: string
}

export function EditorDiffFileDiff({ path, ref }: EditorDiffFileDiffProps) {
  const { repoData } = useEditor()
  const { colorMode } = useColorMode()

  // Fetch file commits to get current and previous
  const { data: fileCommits, isLoading: isLoadingCommits } = useQuery({
    queryKey: [
      'file-commits',
      repoData.repo.owner.login,
      repoData.repo.name,
      path,
      ref,
    ],
    queryFn: () =>
      fetchFileCommits({
        data: {
          owner: repoData.repo.owner.login,
          repo: repoData.repo.name,
          path,
          sha: ref,
          perPage: 2,
        },
      }),
  })

  const previousCommitSha = fileCommits?.previousCommit?.sha

  // Fetch current version
  const {
    data: currentFile,
    isLoading: isLoadingCurrent,
    isError: isErrorCurrent,
    error: errorCurrent,
  } = useQuery({
    queryKey: [
      'file-content',
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
    enabled: !!ref,
  })

  // Fetch previous version
  const {
    data: previousFile,
    isLoading: isLoadingPrevious,
    isError: isErrorPrevious,
  } = useQuery({
    queryKey: [
      'file-content',
      repoData.repo.owner.login,
      repoData.repo.name,
      path,
      previousCommitSha,
    ],
    queryFn: () =>
      fetchFileContent({
        data: {
          owner: repoData.repo.owner.login,
          repo: repoData.repo.name,
          path,
          ref: previousCommitSha!,
        },
      }),
    enabled: !!previousCommitSha,
  })

  const isLoading = isLoadingCommits || isLoadingCurrent || isLoadingPrevious

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
        <Text color="fg.muted">Loading diff...</Text>
      </Box>
    )
  }

  // Handle file creation (no previous version exists OR no previous commit)
  const isFileAdded = !previousCommitSha || (isErrorPrevious && !previousFile)
  // Handle file deletion (no current version exists)
  const isFileDeleted = isErrorCurrent && !currentFile

  // If both current and previous failed (and not due to add/delete), show error
  if (isErrorCurrent && isErrorPrevious && !isFileAdded && !isFileDeleted) {
    return (
      <Box
        h="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p="4"
      >
        <Text color="fg.error" fontSize="sm">
          Error loading diff:{' '}
          {errorCurrent instanceof Error
            ? errorCurrent.message
            : 'Unknown error'}
        </Text>
      </Box>
    )
  }

  // Determine content and language
  const originalContent = isFileAdded ? '' : (previousFile?.content ?? '')
  const modifiedContent = isFileDeleted ? '' : (currentFile?.content ?? '')
  const filePath = currentFile?.path || previousFile?.path || path
  const fileTypeInfo = getFileTypeInfo(filePath)

  // Show message for non-text files
  if (!isTextFile(filePath)) {
    return (
      <Box h="full" display="flex" flexDirection="column" overflow="hidden">
        <EditorBreadcrumb filePath={filePath} />
        <Box
          flex="1"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap="4"
          color="fg.muted"
        >
          <Text fontSize="lg" fontWeight="medium">
            Diff not available
          </Text>
          <Text fontSize="sm">
            Cannot show diff for {fileTypeInfo.displayName.toLowerCase()} files
          </Text>
        </Box>
      </Box>
    )
  }

  return (
    <Box h="full" display="flex" flexDirection="column" overflow="hidden">
      <EditorBreadcrumb filePath={filePath} />
      <Box flex="1" overflow="hidden">
        <DiffEditor
          height="100%"
          language={fileTypeInfo.monacoLanguage || 'plaintext'}
          original={originalContent}
          modified={modifiedContent}
          theme={colorMode === 'dark' ? 'vs-dark' : 'light'}
          options={{
            readOnly: true,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            fontSize: 14,
            renderSideBySide: false,
            enableSplitViewResizing: true,
          }}
        />
      </Box>
    </Box>
  )
}
