'use client'

import { useMemo } from 'react'
import { Box, Text, TreeView, createTreeCollection } from '@chakra-ui/react'
import { LuFile, LuFolder } from 'react-icons/lu'
import { useEditor } from './editor-context'
import type { TreeItem } from '@/types/github'

interface FileNode {
  id: string
  name: string
  children?: Array<FileNode>
}

function buildFileTree(items: Array<TreeItem>): Array<FileNode> {
  const root: Array<FileNode> = []
  const nodeMap = new Map<string, FileNode>()

  // Filter out files starting with __cleanough
  const filteredItems = items.filter((item) => {
    if (!item.path) return false
    // Check if path or any of its segments starts with __cleanough
    return !item.path
      .split('/')
      .some((segment) => segment.startsWith('__cleanough'))
  })

  // Sort items: directories first, then alphabetically
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a.type === 'tree' && b.type !== 'tree') return -1
    if (a.type !== 'tree' && b.type === 'tree') return 1
    return a.path.localeCompare(b.path)
  })

  for (const item of sortedItems) {
    if (!item.path) continue

    const parts = item.path.split('/')
    const name = parts[parts.length - 1]
    const node: FileNode = {
      id: item.path,
      name,
      children: item.type === 'tree' ? [] : undefined,
    }

    nodeMap.set(item.path, node)

    if (parts.length === 1) {
      root.push(node)
    } else {
      const parentPath = parts.slice(0, -1).join('/')
      const parent = nodeMap.get(parentPath)
      if (parent?.children) {
        parent.children.push(node)
      }
    }
  }

  return root
}

interface EditorExplorerProps {
  onFileSelect?: (fileId: string) => void
}

export function EditorExplorer({ onFileSelect }: EditorExplorerProps) {
  const { repoData } = useEditor()

  const fileCollection = useMemo(() => {
    const children = buildFileTree(repoData.tree)
    return createTreeCollection<FileNode>({
      nodeToValue: (node) => node.id,
      nodeToString: (node) => node.name,
      rootNode: {
        id: 'ROOT',
        name: '',
        children,
      },
    })
  }, [repoData.tree])

  // Create a lookup map to check if a path is a file or folder
  const isFile = useMemo(() => {
    const fileMap = new Map<string, boolean>()
    for (const item of repoData.tree) {
      if (item.path) {
        // type 'blob' = file, type 'tree' = folder
        fileMap.set(item.path, item.type === 'blob')
      }
    }
    return fileMap
  }, [repoData.tree])

  return (
    <Box h="full" overflow="auto">
      <Box px="3" py="2" borderBottomWidth="1px" borderColor="border.muted">
        <Text
          fontSize="xs"
          fontWeight="semibold"
          textTransform="uppercase"
          color="fg.muted"
        >
          Explorer
        </Text>
      </Box>
      <Box p="2">
        <TreeView.Root
          collection={fileCollection}
          size="sm"
          onSelectionChange={(details) => {
            const selectedValue = details.selectedValue[0]
            // Only call onFileSelect if it's a file (not a folder)
            if (selectedValue && onFileSelect && isFile.get(selectedValue)) {
              onFileSelect(selectedValue)
            }
          }}
        >
          <TreeView.Tree>
            <TreeView.Node
              indentGuide={<TreeView.BranchIndentGuide />}
              render={({ node, nodeState }) =>
                nodeState.isBranch ? (
                  <TreeView.BranchControl>
                    <LuFolder />
                    <TreeView.BranchText>{node.name}</TreeView.BranchText>
                  </TreeView.BranchControl>
                ) : (
                  <TreeView.Item>
                    <LuFile />
                    <TreeView.ItemText>{node.name}</TreeView.ItemText>
                  </TreeView.Item>
                )
              }
            />
          </TreeView.Tree>
        </TreeView.Root>
      </Box>
    </Box>
  )
}
