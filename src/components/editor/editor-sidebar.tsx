'use client'

import { Tabs } from '@chakra-ui/react'
import { LuFiles, LuHistory, LuPlay } from 'react-icons/lu'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEditor } from './editor-context'

type SidebarView = 'explorer' | 'history' | 'output'

export function EditorSidebar() {
  const { repoData } = useEditor()
  const search = useSearch({ from: '/repos/$owner/$repo' })
  const navigate = useNavigate()

  const activeView: SidebarView = search.mode || 'explorer'

  const handleViewChange = (view: SidebarView) => {
    navigate({
      to: '.',
      search: {
        branch: search.branch,
        commit: search.commit,
        mode: view === 'explorer' ? undefined : view,
        output: view === 'output' ? 0 : undefined,
        file: view === 'history' ? search.file : undefined,
      },
    })
  }
  const hasOutputs = (repoData.cleanoughMeta?.outputs.length ?? 0) > 0

  const items: Array<{
    view: SidebarView
    icon: React.ReactNode
    label: string
    show?: boolean
    isOutputs?: boolean
  }> = [
    { view: 'explorer', icon: <LuFiles />, label: 'Explorer' },
    { view: 'history', icon: <LuHistory />, label: 'History' },
    {
      view: 'output',
      icon: <LuPlay />,
      label: 'Run Output',
      show: hasOutputs,
      isOutputs: true,
    },
  ]

  const visibleItems = items.filter((item) => item.show !== false)

  return (
    <Tabs.Root
      value={activeView}
      onValueChange={(e) => handleViewChange(e.value as SidebarView)}
      orientation="vertical"
      variant="plain"
      h="full"
    >
      <Tabs.List
        w="48px"
        h="full"
        borderRightWidth="1px"
        borderColor="border.muted"
        py="2"
        gap="1"
        bg="bg"
      >
        {visibleItems.map((item) => (
          <Tabs.Trigger
            key={item.view}
            value={item.view}
            aria-label={item.label}
            p="3"
            borderRadius="0"
            color={item.isOutputs ? 'green.500' : 'fg.muted'}
            borderLeftWidth="2px"
            borderLeftColor="transparent"
            fontSize="xl"
            _selected={{
              color: item.isOutputs ? 'green.600' : 'fg',
              borderLeftColor: item.isOutputs ? 'green.500' : 'fg',
            }}
            _hover={{ color: item.isOutputs ? 'green.600' : 'fg' }}
          >
            {item.icon}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  )
}

export type { SidebarView }
