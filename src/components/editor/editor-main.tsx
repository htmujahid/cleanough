'use client'

import { useEffect } from 'react'
import { Box, Icon, Text } from '@chakra-ui/react'
import { LuFile } from 'react-icons/lu'
import { useSearch } from '@tanstack/react-router'
import { useEditor } from './editor-context'
import { EditorTabs } from './editor-tabs'
import { EditorBreadcrumb } from './editor-breadcrumb'
import { EditorContent } from './editor-content'
import type { EditorTab } from './editor-tabs'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface EditorMainProps {
  path: string | null
}

export function EditorMain({ path }: EditorMainProps) {
  const search = useSearch({ from: '/repos/$owner/$repo' })
  const currentCommitSha =
    search.commit || search.branch || useEditor().currentBranch

  // Tab state management with localStorage
  const [tabs, setTabs] = useLocalStorage<Array<EditorTab>>('editor-tabs', [])
  const [activeTabId, setActiveTabId] = useLocalStorage<string | null>(
    'editor-active-tab',
    null,
  )

  // Add or switch to tab when path changes
  useEffect(() => {
    if (!path) return

    const fileName = path.split('/').pop() || path
    const tabId = `${path}-${currentCommitSha}`

    // Check if tab already exists
    const existingTab = tabs.find((tab) => tab.id === tabId)

    if (existingTab) {
      // Switch to existing tab
      setActiveTabId(existingTab.id)
    } else {
      // Create new tab
      const newTab: EditorTab = {
        id: tabId,
        path,
        title: fileName,
        ref: currentCommitSha,
      }
      setTabs([...tabs, newTab])
      setActiveTabId(newTab.id)
    }
  }, [path, currentCommitSha])

  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId)
  }

  const handleTabClose = (tabId: string) => {
    const newTabs = tabs.filter((tab) => tab.id !== tabId)
    setTabs(newTabs)

    // If removing active tab, switch to another tab
    if (activeTabId === tabId) {
      const removedIndex = tabs.findIndex((tab) => tab.id === tabId)
      if (newTabs.length > 0) {
        // Switch to previous tab if available, otherwise next tab
        const newActiveTab = newTabs[Math.max(0, removedIndex - 1)]
        setActiveTabId(newActiveTab.id)
      } else {
        setActiveTabId(null)
      }
    }
  }

  const activeTab = tabs.find((tab) => tab.id === activeTabId)

  // Show empty state if no tabs
  if (tabs.length === 0) {
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
          No file open
        </Text>
        <Text fontSize="sm">Select a file from the explorer to view</Text>
      </Box>
    )
  }

  return (
    <Box h="full" display="flex" flexDirection="column" overflow="hidden">
      {/* Tab bar */}
      <EditorTabs
        tabs={tabs}
        activeTabId={activeTabId}
        onTabChange={handleTabChange}
        onTabClose={handleTabClose}
      />

      {/* Breadcrumb showing file path */}
      {activeTab && <EditorBreadcrumb filePath={activeTab.path} />}

      {/* Active tab content */}
      <Box flex="1" overflow="hidden">
        {activeTab && <EditorContent tab={activeTab} />}
      </Box>
    </Box>
  )
}
