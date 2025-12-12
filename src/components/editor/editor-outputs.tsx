'use client'

import { Box, Text } from '@chakra-ui/react'
import { useEditor } from './editor-context'
import { EditorOutputItem } from './editor-output-item'

interface EditorOutputsProps {
  outputIndex: number
}

export function EditorOutputs({ outputIndex }: EditorOutputsProps) {
  const { repoData } = useEditor()
  const outputs = repoData.cleanoughMeta?.outputs || []

  if (outputs.length === 0) {
    return (
      <Box h="full" display="flex" alignItems="center" justifyContent="center">
        <Text color="fg.muted">No outputs available</Text>
      </Box>
    )
  }

  if (outputIndex < 0 || outputIndex >= outputs.length) {
    return (
      <Box h="full" display="flex" alignItems="center" justifyContent="center">
        <Text color="fg.muted">Output not found</Text>
      </Box>
    )
  }

  const currentOutput = outputs[outputIndex]

  return (
    <Box h="full" overflow="hidden">
      <EditorOutputItem item={currentOutput} />
    </Box>
  )
}
