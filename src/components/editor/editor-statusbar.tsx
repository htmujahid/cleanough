'use client'

import {
  Box,
  HStack,
  Icon,
  IconButton,
  Menu,
  Portal,
  Text,
} from '@chakra-ui/react'
import {
  LuCheck,
  LuChevronLeft,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronsRight,
  LuCircleAlert,
  LuCircleCheck,
  LuGitBranch,
} from 'react-icons/lu'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEditor } from './editor-context'
import { useCommitNavigation } from '@/hooks/useCommitNavigation'

type Mode = 'explorer' | 'history' | 'output'

interface EditorStatusbarProps {
  currentFile?: string
  line?: number
  column?: number
  language?: string
  encoding?: string
  hasErrors?: boolean
  hasWarnings?: boolean
  mode?: Mode
}

export function EditorStatusbar({
  currentFile: _currentFile = 'App.tsx',
  line = 1,
  column = 1,
  language = 'TypeScript React',
  encoding = 'UTF-8',
  hasErrors = false,
  hasWarnings = false,
  mode = 'explorer',
}: EditorStatusbarProps) {
  const { repoData, currentBranch } = useEditor()
  const navigate = useNavigate()
  const navigation = useCommitNavigation()
  const search = useSearch({ from: '/repos/$owner/$repo' })

  const totalOutputs = repoData.cleanoughMeta?.outputs.length ?? 0
  const outputIndex = search.output ?? 0
  const canGoPrevOutput = outputIndex > 0
  const canGoNextOutput = outputIndex < totalOutputs - 1

  const goToPrevOutput = () => {
    if (canGoPrevOutput) {
      navigate({
        to: '.',
        search: { ...search, output: outputIndex - 1 },
      })
    }
  }

  const goToNextOutput = () => {
    if (canGoNextOutput) {
      navigate({
        to: '.',
        search: { ...search, output: outputIndex + 1 },
      })
    }
  }

  const handleBranchChange = (branchName: string) => {
    navigate({
      to: '/repos/$owner/$repo',
      params: {
        owner: repoData.repo.owner.login,
        repo: repoData.repo.name,
      },
      search: { branch: branchName },
    })
  }

  return (
    <Box
      h="24px"
      borderTopWidth="1px"
      borderColor="border.muted"
      px="3"
      display="grid"
      gridTemplateColumns="1fr auto 1fr"
      alignItems="center"
      fontSize="xs"
      color="fg.muted"
    >
      {/* Left side */}
      <HStack gap="4" justifySelf="start">
        <Menu.Root positioning={{ placement: 'top-start' }}>
          <Menu.Trigger asChild>
            <HStack gap="1" cursor="pointer" _hover={{ color: 'fg' }}>
              <Icon boxSize="3">
                <LuGitBranch />
              </Icon>
              <Text>{currentBranch}</Text>
            </HStack>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content maxH="200px" minW="10rem">
                {repoData.branches.map((branch) => (
                  <Menu.Item
                    key={branch.name}
                    value={branch.name}
                    onClick={() => handleBranchChange(branch.name)}
                  >
                    <HStack flex="1" justify="space-between">
                      <Text>{branch.name}</Text>
                      {branch.name === currentBranch && (
                        <Icon boxSize="3">
                          <LuCheck />
                        </Icon>
                      )}
                    </HStack>
                  </Menu.Item>
                ))}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
        <HStack gap="2">
          {hasErrors ? (
            <HStack gap="1" color="red.500">
              <Icon boxSize="3">
                <LuCircleAlert />
              </Icon>
              <Text>0</Text>
            </HStack>
          ) : hasWarnings ? (
            <HStack gap="1" color="yellow.500">
              <Icon boxSize="3">
                <LuCircleAlert />
              </Icon>
              <Text>0</Text>
            </HStack>
          ) : (
            <HStack gap="1" color="green.500">
              <Icon boxSize="3">
                <LuCircleCheck />
              </Icon>
              <Text>0</Text>
            </HStack>
          )}
        </HStack>
      </HStack>

      {/* Center - Navigation controls */}
      {mode === 'output' && totalOutputs > 0 ? (
        <HStack gap="1" justifySelf="center">
          <IconButton
            aria-label="Previous output"
            size="2xs"
            variant="ghost"
            disabled={!canGoPrevOutput}
            onClick={goToPrevOutput}
          >
            <LuChevronLeft />
          </IconButton>
          <Text fontSize="2xs" minW="20" textAlign="center">
            Output {outputIndex + 1}/{totalOutputs}
          </Text>
          <IconButton
            aria-label="Next output"
            size="2xs"
            variant="ghost"
            disabled={!canGoNextOutput}
            onClick={goToNextOutput}
          >
            <LuChevronRight />
          </IconButton>
        </HStack>
      ) : mode === 'history' && navigation.isInHistoryMode ? (
        <HStack gap="1" justifySelf="center">
          <IconButton
            aria-label="Previous commit"
            size="2xs"
            variant="ghost"
            disabled={!navigation.canGoFastBack}
            onClick={navigation.goFastBack}
          >
            <LuChevronsLeft />
          </IconButton>
          <IconButton
            aria-label="Previous item"
            size="2xs"
            variant="ghost"
            disabled={!navigation.canGoBack}
            onClick={navigation.goBack}
          >
            <LuChevronLeft />
          </IconButton>
          <Text fontSize="2xs" minW="36" textAlign="center">
            {navigation.isOnCommitInfo
              ? `Commit ${navigation.currentCommitIndex}/${navigation.totalCommits}`
              : `File ${navigation.currentFileIndex}/${navigation.totalFiles} • Commit ${navigation.currentCommitIndex}/${navigation.totalCommits}`}
          </Text>
          <IconButton
            aria-label="Next item"
            size="2xs"
            variant="ghost"
            disabled={!navigation.canGoForward}
            onClick={navigation.goForward}
          >
            <LuChevronRight />
          </IconButton>
          <IconButton
            aria-label="Next commit"
            size="2xs"
            variant="ghost"
            disabled={!navigation.canGoFastForward}
            onClick={navigation.goFastForward}
          >
            <LuChevronsRight />
          </IconButton>
        </HStack>
      ) : (
        <Box />
      )}

      {/* Right side */}
      <HStack gap="4" justifySelf="end">
        <Text>
          Ln {line}, Col {column}
        </Text>
        <Text>{encoding}</Text>
        <Text>{language}</Text>
      </HStack>
    </Box>
  )
}
