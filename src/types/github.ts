import type { Endpoints } from '@octokit/types'

export type RepoInfo =
  Endpoints['GET /repos/{owner}/{repo}']['response']['data']

export type Branch =
  Endpoints['GET /repos/{owner}/{repo}/branches']['response']['data'][number]

export type TreeItem =
  Endpoints['GET /repos/{owner}/{repo}/git/trees/{tree_sha}']['response']['data']['tree'][number]

export type Commit =
  Endpoints['GET /repos/{owner}/{repo}/commits']['response']['data'][number]

export interface RepoInfoData {
  repo: RepoInfo
  branches: Array<Branch>
  defaultBranch: string
}

export interface CleanoughMetaItem {
  type: 'file' | 'image' | 'terminal'
  path: string
}

export interface CleanoughMeta {
  order: Array<CleanoughMetaItem>
  outputs: Array<CleanoughMetaItem>
}

export interface RepoTreeData {
  tree: Array<TreeItem>
  currentCommit: string | null
  totalCommits: number
  cleanoughMeta: CleanoughMeta | null
}

export interface RepoData extends RepoInfoData, RepoTreeData {}

export interface CommitsResponse {
  commits: Array<Commit>
  hasMore: boolean
}

export type CommitDetails =
  Endpoints['GET /repos/{owner}/{repo}/commits/{ref}']['response']['data']

export type CommitFile = NonNullable<CommitDetails['files']>[number]

export interface CommitDetailsResponse {
  files: Array<CommitFile>
  stats?: {
    additions?: number
    deletions?: number
    total?: number
  }
}

export interface FileContentResponse {
  content: string
  name: string
  path: string
  size: number
  sha: string
  encoding: string | null
}
