'use client'

import { Box, Circle, HStack, Text } from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'
import { useEditor } from './editor-context'
import { ColorModeButton } from '@/integrations/chakra-ui/color-mode'

export function EditorMenubar() {
  const { repoData } = useEditor()
  const navigate = useNavigate()

  const handleClose = () => {
    navigate({ to: '/repos' })
  }

  return (
    <Box
      h="40px"
      borderBottomWidth="1px"
      borderColor="border.muted"
      px="4"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      {/* Mac-like action buttons (left) */}
      <HStack gap="2">
        <Circle
          size="12px"
          bg="red.500"
          cursor="pointer"
          onClick={handleClose}
          _hover={{ opacity: 0.8 }}
          transition="opacity 0.15s"
        />
        <Circle
          size="12px"
          bg="yellow.500"
          cursor="pointer"
          onClick={handleClose}
          _hover={{ opacity: 0.8 }}
          transition="opacity 0.15s"
        />
        <Circle
          size="12px"
          bg="green.500"
          cursor="pointer"
          onClick={handleClose}
          _hover={{ opacity: 0.8 }}
          transition="opacity 0.15s"
        />
      </HStack>

      {/* Repo title (center) */}
      <Text fontSize="sm" fontWeight="medium" color="fg.muted">
        {repoData.repo.full_name}
      </Text>

      {/* Theme toggle (right) */}
      <ColorModeButton />
    </Box>
  )
}
