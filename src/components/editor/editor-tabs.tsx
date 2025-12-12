'use client'

import { CloseButton, Tabs, Text } from '@chakra-ui/react'

export interface EditorTab {
  id: string
  path: string
  title: string
  ref?: string
}

interface EditorTabsProps {
  tabs: Array<EditorTab>
  activeTabId: string | null
  onTabChange: (tabId: string) => void
  onTabClose: (tabId: string) => void
}

export function EditorTabs({
  tabs,
  activeTabId,
  onTabChange,
  onTabClose,
}: EditorTabsProps) {
  if (tabs.length === 0) {
    return null
  }

  return (
    <Tabs.Root
      value={activeTabId || undefined}
      onValueChange={(e) => onTabChange(e.value)}
      variant="line"
      size="sm"
    >
      <Tabs.List borderBottomWidth="1px" borderColor="border.muted">
        {tabs.map((tab) => (
          <Tabs.Trigger
            value={tab.id}
            key={tab.id}
            display="flex"
            gap="2"
            alignItems="center"
          >
            <Text fontSize="sm" fontFamily="mono" truncate maxW="200px">
              {tab.title}
            </Text>
            <CloseButton
              size="2xs"
              onClick={(e) => {
                e.stopPropagation()
                onTabClose(tab.id)
              }}
            />
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  )
}
