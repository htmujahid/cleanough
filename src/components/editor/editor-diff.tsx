'use client'

import { Box, Icon, Text } from '@chakra-ui/react'
import { useSearch } from '@tanstack/react-router'
import { LuFileText } from 'react-icons/lu'
import { useEditor } from './editor-context'
import { EditorDiffImageOutput } from './editor-diff-image-output'
import { EditorDiffTerminalOutput } from './editor-diff-terminal-output'
import { EditorDiffCommitInfo } from './editor-diff-commit-info'
import { EditorDiffFileDiff } from './editor-diff-file-diff'

export function EditorDiff() {
  const { repoData, currentBranch } = useEditor()
  const search = useSearch({ from: '/repos/$owner/$repo' })
  const ref = search.commit || currentBranch

  const order = repoData.cleanoughMeta?.order
  const outputs = repoData.cleanoughMeta?.outputs || []

  // No commit selected - show empty state
  if (!search.commit) {
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
          <LuFileText />
        </Icon>
        <Text fontSize="lg" fontWeight="medium">
          No commit selected
        </Text>
        <Text fontSize="sm">Select a commit from history to view changes</Text>
      </Box>
    )
  }

  // If we have a commit but no file, show commit info
  if (!search.file && search.output === undefined) {
    return <EditorDiffCommitInfo commitSha={search.commit} />
  }

  // Determine what to show based on search params
  if (
    search.output !== undefined &&
    search.output >= 0 &&
    search.output < outputs.length
  ) {
    const outputItem = outputs[search.output]
    if (outputItem.type === 'image') {
      return <EditorDiffImageOutput path={outputItem.path} ref={ref} />
    }
    if (outputItem.type === 'terminal') {
      return <EditorDiffTerminalOutput path={outputItem.path} ref={ref} />
    }
  }

  if (search.file) {
    // Check if this file is in order and what type it is
    const orderItem = order?.find((item) => item.path === search.file)

    if (orderItem?.type === 'image') {
      return <EditorDiffImageOutput path={search.file} ref={ref} />
    }
    if (orderItem?.type === 'terminal') {
      return <EditorDiffTerminalOutput path={search.file} ref={ref} />
    }

    // Default to file diff
    return <EditorDiffFileDiff path={search.file} ref={ref} />
  }

  return (
    <Box h="full" display="flex" alignItems="center" justifyContent="center">
      <Text color="fg.muted">No item selected</Text>
    </Box>
  )
}
