import { createFileRoute } from '@tanstack/react-router'
import type { RepoData, RepoInfo } from '@/types/github'
import { EditorLayout } from '@/components/editor/editor-layout'
import { EditorProvider } from '@/components/editor/editor-context'
import { fetchRepoData, fetchRepoInfo } from '@/lib/github'

interface RepoSearchParams {
  branch?: string
  commit?: string
  file?: string
  output?: number
  mode?: 'explorer' | 'history' | 'output'
}

export const Route = createFileRoute('/repos/$owner/$repo')({
  validateSearch: (search: Record<string, unknown>): RepoSearchParams => {
    const mode = search.mode
    return {
      branch: typeof search.branch === 'string' ? search.branch : undefined,
      commit: typeof search.commit === 'string' ? search.commit : undefined,
      file: typeof search.file === 'string' ? search.file : undefined,
      output:
        typeof search.output === 'number'
          ? search.output
          : typeof search.output === 'string'
            ? parseInt(search.output, 10)
            : undefined,
      mode:
        mode === 'explorer' || mode === 'history' || mode === 'output'
          ? mode
          : undefined,
    }
  },
  loaderDeps: ({ search: { branch, commit } }) => ({ branch, commit }),
  loader: async ({ params, deps }) => {
    // Fetch static repo info (highly cacheable)
    const repoInfo = await fetchRepoInfo({
      data: { owner: params.owner, repo: params.repo },
    })

    // Determine branch to use
    const branch = deps.branch || (repoInfo as RepoInfo).default_branch

    // Fetch dynamic tree data based on branch/commit
    const repoTreeData = await fetchRepoData({
      data: {
        owner: params.owner,
        repo: params.repo,
        branch,
        commit: deps.commit,
      },
    })

    // Merge both results
    return {
      ...repoInfo,
      ...repoTreeData,
    }
  },
  component: RepoEditorPage,
})

function RepoEditorPage() {
  const { branch } = Route.useSearch()
  const repoData = Route.useLoaderData()
  const currentBranch = branch || repoData.repo.default_branch

  return (
    <EditorProvider repoData={repoData} currentBranch={currentBranch}>
      <EditorLayout />
    </EditorProvider>
  )
}
