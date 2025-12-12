'use client'

import { Accordion, Box, HStack, Icon, Spinner, Text } from '@chakra-ui/react'
import { LuGitCommitVertical, LuUser } from 'react-icons/lu'
import { formatDistanceToNow } from 'date-fns'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useEditor } from './editor-context'
import { EditorCommitFileList } from './editor-commit-file-list'
import type { CleanoughMeta, Commit } from '@/types/github'
import { fetchCleanoughMeta, fetchCommitDetails } from '@/lib/github'

interface EditorCommitItemProps {
  commit: Commit
  isExpanded: boolean
}

export function EditorCommitItem({
  commit,
  isExpanded,
}: EditorCommitItemProps) {
  const { repoData, currentBranch } = useEditor()
  const navigate = useNavigate()
  const search = useSearch({ from: '/repos/$owner/$repo' })

  const { data, isLoading } = useQuery({
    queryKey: [
      'commit-details',
      repoData.repo.owner.login,
      repoData.repo.name,
      commit.sha,
    ],
    queryFn: () =>
      fetchCommitDetails({
        data: {
          owner: repoData.repo.owner.login,
          repo: repoData.repo.name,
          sha: commit.sha,
        },
      }),
    enabled: isExpanded,
  })

  // Fetch cleanough meta for this specific commit
  const { data: cleanoughMeta } = useQuery<CleanoughMeta | null>({
    queryKey: [
      'cleanough-meta',
      repoData.repo.owner.login,
      repoData.repo.name,
      commit.sha,
    ],
    queryFn: () =>
      fetchCleanoughMeta({
        data: {
          owner: repoData.repo.owner.login,
          repo: repoData.repo.name,
          ref: commit.sha,
        },
      }),
    enabled: isExpanded,
  })

  const handleCommitClick = () => {
    navigate({
      to: '.',
      search: {
        mode: 'history',
        branch: search.branch || currentBranch,
        commit: commit.sha,
        file: undefined,
        output: undefined,
      },
    })
  }

  return (
    <Accordion.Item value={commit.sha}>
      <Accordion.ItemTrigger
        px="3"
        py="2"
        display="flex"
        gap="2"
        w="full"
        onClick={handleCommitClick}
      >
        <Icon color="fg.muted" mt="0.5" flexShrink="0">
          <LuGitCommitVertical />
        </Icon>
        <Box flex="1" minW="0">
          <Text fontSize="sm" fontWeight="medium" truncate>
            {commit.commit.message.split('\n')[0]}
          </Text>
          <HStack gap="1" color="fg.muted">
            <Icon boxSize="3">
              <LuUser />
            </Icon>
            <Text fontSize="xs" truncate>
              {commit.commit.author?.name ?? 'Unknown'}
            </Text>
            <Text fontSize="xs">·</Text>
            <Text fontSize="xs">
              {commit.commit.author?.date
                ? formatDistanceToNow(new Date(commit.commit.author.date), {
                    addSuffix: true,
                  })
                : ''}
            </Text>
          </HStack>
        </Box>
        <Accordion.ItemIndicator flexShrink="0" />
      </Accordion.ItemTrigger>
      <Accordion.ItemContent>
        <Accordion.ItemBody px="3" py="2">
          {isLoading ? (
            <HStack justify="center" py="4">
              <Spinner size="sm" />
              <Text fontSize="sm" color="fg.muted">
                Loading files...
              </Text>
            </HStack>
          ) : data?.files && data.files.length > 0 ? (
            <EditorCommitFileList
              files={data.files}
              stats={data.stats}
              cleanoughMeta={cleanoughMeta}
              commitSha={commit.sha}
            />
          ) : (
            <Text fontSize="sm" color="fg.muted" textAlign="center" py="2">
              No files changed
            </Text>
          )}
        </Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  )
}
