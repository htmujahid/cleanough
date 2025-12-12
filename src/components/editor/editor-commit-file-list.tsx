'use client'

import { Badge, HStack, Icon, Text, VStack } from '@chakra-ui/react'
import {
  LuFileMinus,
  LuFilePlus,
  LuFileText,
  LuImage,
  LuPencil,
  LuTerminal,
} from 'react-icons/lu'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEditor } from './editor-context'
import type { CleanoughMeta } from '@/types/github'

interface EditorCommitFileListProps {
  files: Array<{
    filename: string
    status: string
    additions: number
    deletions: number
  }>
  stats?: {
    additions?: number
    deletions?: number
  }
  cleanoughMeta: CleanoughMeta | null | undefined
  commitSha: string
}

export function EditorCommitFileList({
  files,
  stats,
  cleanoughMeta,
  commitSha,
}: EditorCommitFileListProps) {
  const { currentBranch } = useEditor()
  const navigate = useNavigate()
  const search = useSearch({ from: '/repos/$owner/$repo' })

  const order = cleanoughMeta?.order
  const filteredFiles = files.filter(
    (file) => !file.filename.startsWith('__cleanough'),
  )
  const filePaths = new Set(filteredFiles.map((f) => f.filename))

  // Build items list: use order if available (filtered to this commit's files), otherwise use filtered files
  const items: Array<{
    type: 'file' | 'image' | 'terminal'
    path: string
    file?: (typeof filteredFiles)[0]
  }> = order
    ? order
        .filter(
          (o) =>
            o.type === 'image' ||
            o.type === 'terminal' ||
            filePaths.has(o.path),
        )
        .map((orderItem) => {
          const file = filteredFiles.find((f) => f.filename === orderItem.path)
          return {
            type: orderItem.type,
            path: orderItem.path,
            file,
          }
        })
    : filteredFiles.map((file) => ({
        type: 'file' as const,
        path: file.filename,
        file,
      }))

  const fileCount = items.filter(
    (item) => item.type === 'file' && item.file,
  ).length

  const getFileIcon = (status: string) => {
    switch (status) {
      case 'added':
        return (
          <Icon color="green.500">
            <LuFilePlus />
          </Icon>
        )
      case 'removed':
        return (
          <Icon color="red.500">
            <LuFileMinus />
          </Icon>
        )
      case 'modified':
        return (
          <Icon color="blue.500">
            <LuPencil />
          </Icon>
        )
      default:
        return (
          <Icon color="fg.muted">
            <LuFileText />
          </Icon>
        )
    }
  }

  const getItemIcon = (item: (typeof items)[0]) => {
    if (item.type === 'image') {
      return (
        <Icon color="purple.500">
          <LuImage />
        </Icon>
      )
    }
    if (item.type === 'terminal') {
      return (
        <Icon color="orange.500">
          <LuTerminal />
        </Icon>
      )
    }
    if (item.file) {
      return getFileIcon(item.file.status)
    }
    return (
      <Icon color="fg.muted">
        <LuFileText />
      </Icon>
    )
  }

  const handleItemClick = (item: (typeof items)[0]) => {
    navigate({
      to: '.',
      search: {
        mode: 'history',
        branch: search.branch || currentBranch,
        commit: commitSha,
        file: item.path,
        output: undefined,
      },
    })
  }

  return (
    <VStack gap="1" align="stretch">
      {stats && (
        <HStack gap="2" mb="2" fontSize="xs" color="fg.muted">
          <Badge colorPalette="green" variant="subtle" size="sm">
            +{stats.additions || 0}
          </Badge>
          <Badge colorPalette="red" variant="subtle" size="sm">
            -{stats.deletions || 0}
          </Badge>
          <Text>
            {fileCount} {fileCount === 1 ? 'file' : 'files'} changed
          </Text>
        </HStack>
      )}
      {items.map((item) => (
        <HStack
          key={item.path}
          gap="2"
          px="2"
          py="1"
          borderRadius="sm"
          cursor="pointer"
          _hover={{ bg: 'bg.subtle' }}
          onClick={() => handleItemClick(item)}
        >
          {getItemIcon(item)}
          <Text fontSize="xs" flex="1" truncate fontFamily="mono">
            {item.path}
          </Text>
          {item.type === 'file' && item.file && (
            <HStack gap="1" fontSize="xs">
              <Text color="green.500">+{item.file.additions}</Text>
              <Text color="red.500">-{item.file.deletions}</Text>
            </HStack>
          )}
          {item.type === 'image' && (
            <Badge colorPalette="purple" variant="subtle" size="sm">
              image
            </Badge>
          )}
          {item.type === 'terminal' && (
            <Badge colorPalette="orange" variant="subtle" size="sm">
              terminal
            </Badge>
          )}
        </HStack>
      ))}
    </VStack>
  )
}
