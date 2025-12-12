'use client'

import {
  Badge,
  Box,
  HStack,
  Icon,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import {
  LuCalendar,
  LuFileMinus,
  LuFilePlus,
  LuFileText,
  LuGitCommitVertical,
  LuImage,
  LuPencil,
  LuTerminal,
  LuUser,
} from 'react-icons/lu'
import { format, formatDistanceToNow } from 'date-fns'
import { useEditor } from './editor-context'
import type { CleanoughMeta } from '@/types/github'
import { fetchCleanoughMeta, fetchCommitDetails } from '@/lib/github'

interface EditorDiffCommitInfoProps {
  commitSha: string
}

export function EditorDiffCommitInfo({ commitSha }: EditorDiffCommitInfoProps) {
  const { repoData } = useEditor()

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      'commit-details',
      repoData.repo.owner.login,
      repoData.repo.name,
      commitSha,
    ],
    queryFn: () =>
      fetchCommitDetails({
        data: {
          owner: repoData.repo.owner.login,
          repo: repoData.repo.name,
          sha: commitSha,
        },
      }),
  })

  // Fetch cleanough meta for this specific commit
  const { data: cleanoughMeta } = useQuery<CleanoughMeta | null>({
    queryKey: [
      'cleanough-meta',
      repoData.repo.owner.login,
      repoData.repo.name,
      commitSha,
    ],
    queryFn: () =>
      fetchCleanoughMeta({
        data: {
          owner: repoData.repo.owner.login,
          repo: repoData.repo.name,
          ref: commitSha,
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
        <Text color="fg.muted">Loading commit info...</Text>
      </Box>
    )
  }

  if (isError || !data) {
    return (
      <Box h="full" display="flex" alignItems="center" justifyContent="center">
        <Text color="fg.error" fontSize="sm">
          Failed to load commit details
        </Text>
      </Box>
    )
  }

  const filteredFiles = data.files.filter(
    (f) => !f.filename.startsWith('__cleanough'),
  )
  const filePaths = new Set(filteredFiles.map((f) => f.filename))
  const order = cleanoughMeta?.order
  const commitDate = data.commit.author?.date
    ? new Date(data.commit.author.date)
    : null

  // Build items list: use order if available (filtered to this commit's files + outputs), otherwise use filtered files
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
          <Icon boxSize="4" color="green.500">
            <LuFilePlus />
          </Icon>
        )
      case 'removed':
        return (
          <Icon boxSize="4" color="red.500">
            <LuFileMinus />
          </Icon>
        )
      case 'modified':
        return (
          <Icon boxSize="4" color="blue.500">
            <LuPencil />
          </Icon>
        )
      default:
        return (
          <Icon boxSize="4" color="fg.muted">
            <LuFileText />
          </Icon>
        )
    }
  }

  const getItemIcon = (item: (typeof items)[0]) => {
    if (item.type === 'image') {
      return (
        <Icon boxSize="4" color="purple.500">
          <LuImage />
        </Icon>
      )
    }
    if (item.type === 'terminal') {
      return (
        <Icon boxSize="4" color="orange.500">
          <LuTerminal />
        </Icon>
      )
    }
    if (item.file) {
      return getFileIcon(item.file.status)
    }
    return (
      <Icon boxSize="4" color="fg.muted">
        <LuFileText />
      </Icon>
    )
  }

  return (
    <Box h="full" overflow="auto" p="6">
      <VStack gap="6" align="stretch" maxW="800px" mx="auto">
        {/* Commit header */}
        <VStack gap="3" align="stretch">
          <HStack gap="3">
            <Icon boxSize="6" color="fg.muted">
              <LuGitCommitVertical />
            </Icon>
            <Text fontSize="xl" fontWeight="semibold">
              {data.commit.message.split('\n')[0] || 'Commit'}
            </Text>
          </HStack>

          {/* Commit body if exists */}
          {data.commit.message.includes('\n') && (
            <Text fontSize="sm" color="fg.muted" whiteSpace="pre-wrap" pl="9">
              {data.commit.message.split('\n').slice(1).join('\n').trim()}
            </Text>
          )}
        </VStack>

        {/* Commit metadata */}
        <HStack gap="6" flexWrap="wrap" pl="9">
          <HStack gap="2" color="fg.muted">
            <Icon boxSize="4">
              <LuUser />
            </Icon>
            <Text fontSize="sm">{data.commit.author?.name || 'Unknown'}</Text>
          </HStack>

          {commitDate && (
            <HStack gap="2" color="fg.muted">
              <Icon boxSize="4">
                <LuCalendar />
              </Icon>
              <Text fontSize="sm">
                {format(commitDate, 'MMM d, yyyy')} (
                {formatDistanceToNow(commitDate, { addSuffix: true })})
              </Text>
            </HStack>
          )}

          <Text fontSize="xs" fontFamily="mono" color="fg.muted">
            {commitSha.slice(0, 7)}
          </Text>
        </HStack>

        {/* Stats */}
        {data.stats && (
          <HStack gap="3" pl="9">
            <Badge colorPalette="green" variant="subtle">
              +{data.stats.additions || 0}
            </Badge>
            <Badge colorPalette="red" variant="subtle">
              -{data.stats.deletions || 0}
            </Badge>
            <Text fontSize="sm" color="fg.muted">
              {fileCount} {fileCount === 1 ? 'file' : 'files'} changed
            </Text>
          </HStack>
        )}

        {/* Items list (files + outputs in order) */}
        <VStack gap="2" align="stretch" pl="9" pt="2">
          <Text fontSize="sm" fontWeight="medium" color="fg.muted">
            Changed files:
          </Text>
          {items.map((item) => (
            <HStack key={item.path} gap="2" fontSize="sm">
              {getItemIcon(item)}
              <Text fontFamily="mono" flex="1" truncate>
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

        {/* Navigation hint */}
        <Box pl="9" pt="4">
          <Text fontSize="sm" color="fg.muted">
            Press → to view file changes
          </Text>
        </Box>
      </VStack>
    </Box>
  )
}
