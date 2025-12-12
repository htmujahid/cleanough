import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import type { CleanoughMeta } from '@/types/github'
import { useEditor } from '@/components/editor/editor-context'
import {
  fetchCleanoughMeta,
  fetchCommitDetails,
  fetchCommits,
} from '@/lib/github'

interface OrderItem {
  type: 'file' | 'image' | 'terminal'
  path: string
}

export function useCommitNavigation() {
  const { repoData, currentBranch } = useEditor()
  const search = useSearch({ from: '/repos/$owner/$repo' })
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const currentCommitSha = search.commit
  const currentFile = search.file

  // Fetch all commits to know the order (oldest to newest)
  const { data: allCommitsData } = useQuery({
    queryKey: [
      'all-commits',
      repoData.repo.owner.login,
      repoData.repo.name,
      currentBranch,
    ],
    queryFn: async () => {
      const perPage = 100
      const totalPages = Math.ceil(repoData.totalCommits / perPage)
      const pages = []

      // Fetch all pages
      for (let page = totalPages; page >= 1; page--) {
        const response = await fetchCommits({
          data: {
            owner: repoData.repo.owner.login,
            repo: repoData.repo.name,
            branch: currentBranch,
            page,
            perPage,
          },
        })
        pages.push(...response.commits.reverse())
      }

      return pages
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Fetch current commit details to get list of files
  const { data: currentCommitDetails } = useQuery({
    queryKey: [
      'commit-details',
      repoData.repo.owner.login,
      repoData.repo.name,
      currentCommitSha,
    ],
    queryFn: () =>
      currentCommitSha
        ? fetchCommitDetails({
            data: {
              owner: repoData.repo.owner.login,
              repo: repoData.repo.name,
              sha: currentCommitSha,
            },
          })
        : Promise.resolve(null),
    enabled: !!currentCommitSha,
  })

  // Fetch cleanough meta for the current commit
  const { data: currentCleanoughMeta } = useQuery<CleanoughMeta | null>({
    queryKey: [
      'cleanough-meta',
      repoData.repo.owner.login,
      repoData.repo.name,
      currentCommitSha,
    ],
    queryFn: () =>
      currentCommitSha
        ? fetchCleanoughMeta({
            data: {
              owner: repoData.repo.owner.login,
              repo: repoData.repo.name,
              ref: currentCommitSha,
            },
          })
        : Promise.resolve(null),
    enabled: !!currentCommitSha,
  })

  const commits = allCommitsData || []
  const currentCommitIndex = commits.findIndex(
    (c) => c.sha === currentCommitSha,
  )

  // Build items list from commit files, optionally ordered by meta.json order
  const order = currentCleanoughMeta?.order
  const filteredFiles = (currentCommitDetails?.files || []).filter(
    (f) => !f.filename.startsWith('__cleanough'),
  )
  const filePaths = new Set(filteredFiles.map((f) => f.filename))

  // Build items: if order exists, use it to order/filter commit files + include outputs
  // Otherwise just use the commit's files
  const items: Array<OrderItem> = order
    ? order
        .filter((o) => {
          // Include if it's an output type OR if it's a file that exists in this commit
          return (
            o.type === 'image' || o.type === 'terminal' || filePaths.has(o.path)
          )
        })
        .map((o) => ({
          type: o.type,
          path: o.path,
        }))
    : filteredFiles.map((f) => ({ type: 'file' as const, path: f.filename }))

  // Check if we're on commit info page (commit selected but no file)
  const isOnCommitInfo = !!currentCommitSha && !currentFile

  // Find current item index based on file path (-1 means on commit info or not found)
  const currentItemIndex = currentFile
    ? items.findIndex((item) => item.path === currentFile)
    : -1

  // Navigation logic: commit info → file 1 → file 2 → ... → next commit info
  const hasNextItemInCommit = isOnCommitInfo
    ? items.length > 0
    : currentItemIndex < items.length - 1
  const hasPrevItemInCommit = !isOnCommitInfo && currentItemIndex > 0
  const hasPrevToCommitInfo = !isOnCommitInfo && currentItemIndex === 0 // Can go back to commit info
  const hasNextCommit = currentCommitIndex < commits.length - 1
  const hasPrevCommit = currentCommitIndex > 0

  const canGoBack =
    hasPrevItemInCommit ||
    hasPrevToCommitInfo ||
    (isOnCommitInfo && hasPrevCommit)
  const canGoForward = hasNextItemInCommit || hasNextCommit

  const navigateToItem = (item: OrderItem, commitSha: string) => {
    // All items navigate with file path - EditorDiff handles rendering based on type
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

  const navigateToCommitInfo = (commitSha: string) => {
    // Navigate to commit info page (no file selected)
    navigate({
      to: '.',
      search: {
        mode: 'history',
        branch: search.branch || currentBranch,
        commit: commitSha,
        file: undefined,
        output: undefined,
      },
    })
  }

  // Get items for a commit (uses order if available to sort, otherwise just fetches files)
  // Uses queryClient.fetchQuery to ensure data is cached for the component
  const getCommitItems = async (
    commitSha: string,
  ): Promise<Array<OrderItem>> => {
    // Fetch both commit details and cleanough meta for the target commit
    const [details, commitMeta] = await Promise.all([
      queryClient.fetchQuery({
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
      }),
      queryClient.fetchQuery<CleanoughMeta | null>({
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
      }),
    ])

    const commitFiles = details.files.filter(
      (f: { filename: string }) => !f.filename.startsWith('__cleanough'),
    )
    const commitFilePaths = new Set(
      commitFiles.map((f: { filename: string }) => f.filename),
    )
    const commitOrder = commitMeta?.order

    if (commitOrder) {
      // Filter order to only include items that exist in this commit (or are outputs)
      return commitOrder
        .filter(
          (o) =>
            o.type === 'image' ||
            o.type === 'terminal' ||
            commitFilePaths.has(o.path),
        )
        .map((o) => ({
          type: o.type,
          path: o.path,
        }))
    }

    return commitFiles.map((f: { filename: string }) => ({
      type: 'file' as const,
      path: f.filename,
    }))
  }

  // Back: Previous item in commit, or commit info, or last item of previous commit
  const goBack = () => {
    if (hasPrevItemInCommit) {
      // Go to previous file in same commit
      const prevItem = items[currentItemIndex - 1]
      navigateToItem(prevItem, currentCommitSha!)
    } else if (hasPrevToCommitInfo) {
      // Go back to commit info page
      navigateToCommitInfo(currentCommitSha!)
    } else if (isOnCommitInfo && hasPrevCommit) {
      // On commit info, go to last item of previous commit
      const prevCommit = commits[currentCommitIndex - 1]
      getCommitItems(prevCommit.sha).then((commitItems) => {
        // Find the last item (could be file or output)
        if (commitItems.length > 0) {
          const lastItem = commitItems[commitItems.length - 1]
          navigateToItem(lastItem, prevCommit.sha)
        } else {
          // No items in previous commit, go to its commit info
          navigateToCommitInfo(prevCommit.sha)
        }
      })
    }
  }

  // Forward: Next item in commit, or commit info of next commit
  const goForward = () => {
    if (isOnCommitInfo && items.length > 0 && currentCommitSha) {
      // On commit info, go to first file
      const firstItem = items[0]
      navigateToItem(firstItem, currentCommitSha)
    } else if (hasNextItemInCommit && currentCommitSha) {
      // Go to next file in same commit
      const nextItem = items[currentItemIndex + 1]
      navigateToItem(nextItem, currentCommitSha)
    } else if (hasNextCommit) {
      // Go to next commit's info page
      const nextCommit = commits[currentCommitIndex + 1]
      navigateToCommitInfo(nextCommit.sha)
    }
  }

  // Fast Back: Commit info of previous commit
  const goFastBack = () => {
    if (hasPrevCommit) {
      const prevCommit = commits[currentCommitIndex - 1]
      navigateToCommitInfo(prevCommit.sha)
    }
  }

  // Fast Forward: Commit info of next commit
  const goFastForward = () => {
    if (hasNextCommit) {
      const nextCommit = commits[currentCommitIndex + 1]
      navigateToCommitInfo(nextCommit.sha)
    }
  }

  const isInHistoryMode = !!currentCommitSha

  // For display: 0 means commit info, 1+ means file index
  const displayFileIndex = isOnCommitInfo
    ? 0
    : currentItemIndex >= 0
      ? currentItemIndex + 1
      : 1

  return {
    canGoBack,
    canGoForward,
    canGoFastBack: hasPrevCommit,
    canGoFastForward: hasNextCommit,
    goBack,
    goForward,
    goFastBack,
    goFastForward,
    currentCommitIndex: currentCommitIndex + 1, // 1-based for display
    totalCommits: commits.length,
    currentFileIndex: displayFileIndex,
    totalFiles: items.length,
    isInHistoryMode,
    isOnCommitInfo,
  }
}
