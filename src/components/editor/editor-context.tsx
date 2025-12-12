'use client'

import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { RepoData } from '@/types/github'

interface EditorContextValue {
  repoData: RepoData
  currentBranch: string
}

const EditorContext = createContext<EditorContextValue | null>(null)

interface EditorProviderProps {
  repoData: RepoData
  currentBranch: string
  children: ReactNode
}

export function EditorProvider({
  repoData,
  currentBranch,
  children,
}: EditorProviderProps) {
  return (
    <EditorContext.Provider value={{ repoData, currentBranch }}>
      {children}
    </EditorContext.Provider>
  )
}

export function useEditor() {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider')
  }
  return context
}
