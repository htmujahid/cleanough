'use client'

import { useState } from 'react'
import { Box, Flex, Icon, Splitter, Text } from '@chakra-ui/react'
import { LuFile } from 'react-icons/lu'
import { useSearch } from '@tanstack/react-router'
import { EditorMenubar } from './editor-menubar'
import { EditorSidebar } from './editor-sidebar'
import { EditorExplorer } from './editor-explorer'
import { EditorHistory } from './editor-history'
import { EditorStatusbar } from './editor-statusbar'
import { EditorMain } from './editor-main'
import { EditorDiff } from './editor-diff'
import { EditorOutputs } from './editor-outputs'
import type { SidebarView } from './editor-sidebar'
import { getFileDisplayName } from '@/lib/file-utils'

export function EditorLayout() {
  const [selectedExplorerFile, setSelectedExplorerFile] = useState<
    string | null
  >(null)
  const search = useSearch({ from: '/repos/$owner/$repo' })

  // Get mode from search params, default to 'explorer'
  const mode: SidebarView = search.mode || 'explorer'

  const handleExplorerFileSelect = (filePath: string) => {
    setSelectedExplorerFile(filePath)
  }

  const renderSidebarContent = () => {
    switch (mode) {
      case 'explorer':
        return <EditorExplorer onFileSelect={handleExplorerFileSelect} />
      case 'history':
        return <EditorHistory />
      case 'output':
        return <EditorExplorer onFileSelect={handleExplorerFileSelect} />
      default:
        return null
    }
  }

  const outputIndex = search.output ?? 0

  const renderEditorContent = () => {
    switch (mode) {
      case 'output':
        return <EditorOutputs outputIndex={outputIndex} />
      case 'explorer':
        return <EditorMain path={selectedExplorerFile} />
      case 'history':
        return <EditorDiff />
      default:
        // Default empty state (should not reach here with current modes)
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
              <LuFile />
            </Icon>
            <Text fontSize="lg" fontWeight="medium">
              No content
            </Text>
          </Box>
        )
    }
  }

  const currentFile = mode === 'explorer' ? selectedExplorerFile : search.file
  const currentLanguage = currentFile
    ? getFileDisplayName(currentFile)
    : 'Plain Text'

  return (
    <Flex direction="column" h="100vh" w="100vw" overflow="hidden">
      {/* Menubar */}
      <EditorMenubar />

      {/* Main content area */}
      <Flex flex="1" overflow="hidden">
        {/* Activity bar (icon sidebar) */}
        <EditorSidebar />

        {/* Splitter for sidebar and editor */}
        <Splitter.Root
          flex="1"
          h="full"
          defaultSize={[22, 78]}
          panels={[
            {
              id: 'sidebar',
              minSize: 22,
              maxSize: 40,
              collapsible: true,
              collapsedSize: 0,
            },
            { id: 'editor', minSize: 40 },
          ]}
        >
          {/* Side panel content */}
          <Splitter.Panel id="sidebar">
            <Box
              h="full"
              overflow="hidden"
              borderRightWidth="1px"
              borderColor="border.muted"
            >
              {renderSidebarContent()}
            </Box>
          </Splitter.Panel>

          <Splitter.ResizeTrigger id="sidebar:editor" />

          {/* Editor area */}
          <Splitter.Panel id="editor">
            <Box h="full" overflow="hidden">
              {renderEditorContent()}
            </Box>
          </Splitter.Panel>
        </Splitter.Root>
      </Flex>

      {/* Statusbar */}
      <EditorStatusbar
        line={1}
        column={1}
        language={currentLanguage}
        encoding="UTF-8"
        mode={mode}
      />
    </Flex>
  )
}
