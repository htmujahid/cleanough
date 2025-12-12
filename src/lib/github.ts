import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { Octokit } from 'octokit'
import { auth } from './auth'

// Fetch static repo info and branches (highly cacheable)
export const fetchRepoInfo = createServerFn({ method: 'GET' })
  .inputValidator((data: { owner: string; repo: string }) => data)
  .handler(async ({ data }): Promise<{}> => {
    const headers = getRequestHeaders()
    const token = await auth.api.getAccessToken({
      body: {
        providerId: 'github',
      },
      headers,
    })

    const octokit = new Octokit({ auth: token.accessToken })

    const [repoResponse, branchesResponse] = await Promise.all([
      octokit.rest.repos.get({ owner: data.owner, repo: data.repo }),
      octokit.rest.repos.listBranches({ owner: data.owner, repo: data.repo }),
    ])

    return {
      repo: repoResponse.data,
      branches: branchesResponse.data,
      default_branch: repoResponse.data.default_branch,
    }
  })

// Fetch dynamic data based on branch/commit (tree, commit count)
export const fetchRepoData = createServerFn({ method: 'GET' })
  .inputValidator(
    (data: { owner: string; repo: string; branch: string; commit?: string }) =>
      data,
  )
  .handler(async ({ data }): Promise<{}> => {
    const headers = getRequestHeaders()
    const token = await auth.api.getAccessToken({
      body: {
        providerId: 'github',
      },
      headers,
    })

    const octokit = new Octokit({ auth: token.accessToken })

    const treeRef = data.commit || data.branch

    const [commitsCountResponse, treeResponse] = await Promise.all([
      // Fetch first page to get total count from headers
      octokit.rest.repos.listCommits({
        owner: data.owner,
        repo: data.repo,
        sha: data.branch,
        per_page: 1,
      }),
      octokit.rest.git.getTree({
        owner: data.owner,
        repo: data.repo,
        tree_sha: treeRef,
        recursive: 'true',
      }),
    ])

    // Parse Link header to get total commit count
    const linkHeader = commitsCountResponse.headers.link
    let totalCommits = 1 // Default to 1 if no pagination

    if (linkHeader) {
      // Parse last page number from Link header
      // Example: <https://api.github.com/...?page=2>; rel="next", <https://api.github.com/...?page=50>; rel="last"
      const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/)
      if (lastPageMatch) {
        const lastPage = parseInt(lastPageMatch[1], 10)
        // Since we used per_page=1, lastPage equals total commits
        totalCommits = lastPage
      }
    }

    // Try to fetch __cleanough/meta.json if it exists
    let cleanoughMeta = null
    try {
      const metaResponse = await octokit.rest.repos.getContent({
        owner: data.owner,
        repo: data.repo,
        path: '__cleanough/meta.json',
        ref: treeRef,
      })

      if (
        !Array.isArray(metaResponse.data) &&
        metaResponse.data.type === 'file'
      ) {
        const content = metaResponse.data.content
          ? Buffer.from(metaResponse.data.content, 'base64').toString('utf-8')
          : ''
        cleanoughMeta = JSON.parse(content)
      }
    } catch {
      // File doesn't exist, ignore
    }

    return {
      tree: treeResponse.data.tree,
      currentCommit: data.commit || null,
      totalCommits,
      cleanoughMeta,
    }
  })

export const fetchCommits = createServerFn({ method: 'GET' })
  .inputValidator(
    (data: {
      owner: string
      repo: string
      branch: string
      page?: number
      perPage?: number
    }) => data,
  )
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()
    const token = await auth.api.getAccessToken({
      body: {
        providerId: 'github',
      },
      headers,
    })

    const octokit = new Octokit({ auth: token.accessToken })

    const response = await octokit.rest.repos.listCommits({
      owner: data.owner,
      repo: data.repo,
      sha: data.branch,
      page: data.page || 1,
      per_page: data.perPage || 30,
    })

    return {
      commits: response.data,
      hasMore: response.data.length === (data.perPage || 30),
    }
  })

export const fetchCommitDetails = createServerFn({ method: 'GET' })
  .inputValidator((data: { owner: string; repo: string; sha: string }) => data)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()
    const token = await auth.api.getAccessToken({
      body: {
        providerId: 'github',
      },
      headers,
    })

    const octokit = new Octokit({ auth: token.accessToken })

    const response = await octokit.rest.repos.getCommit({
      owner: data.owner,
      repo: data.repo,
      ref: data.sha,
    })

    return {
      files: response.data.files || [],
      stats: response.data.stats,
      commit: response.data.commit,
      sha: response.data.sha,
    }
  })

export const fetchFileContent = createServerFn({ method: 'GET' })
  .inputValidator(
    (data: { owner: string; repo: string; path: string; ref?: string }) => data,
  )
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()
    const token = await auth.api.getAccessToken({
      body: {
        providerId: 'github',
      },
      headers,
    })

    const octokit = new Octokit({ auth: token.accessToken })

    const response = await octokit.rest.repos.getContent({
      owner: data.owner,
      repo: data.repo,
      path: data.path,
      ref: data.ref,
    })

    // Handle file content (response can be file, directory, or symlink)
    if (Array.isArray(response.data)) {
      throw new Error('Path is a directory, not a file')
    }

    if (response.data.type !== 'file') {
      throw new Error(`Path is a ${response.data.type}, not a file`)
    }

    // Decode base64 content
    const content = response.data.content
      ? Buffer.from(response.data.content, 'base64').toString('utf-8')
      : ''

    return {
      content,
      name: response.data.name,
      path: response.data.path,
      size: response.data.size,
      sha: response.data.sha,
      encoding: response.data.encoding,
      download_url: response.data.download_url,
    }
  })

export const fetchFileCommits = createServerFn({ method: 'GET' })
  .inputValidator(
    (data: {
      owner: string
      repo: string
      path: string
      sha: string
      perPage?: number
    }) => data,
  )
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()
    const token = await auth.api.getAccessToken({
      body: {
        providerId: 'github',
      },
      headers,
    })

    const octokit = new Octokit({ auth: token.accessToken })

    const response = await octokit.rest.repos.listCommits({
      owner: data.owner,
      repo: data.repo,
      path: data.path,
      sha: data.sha,
      per_page: data.perPage || 2,
    })

    return {
      commits: response.data,
      currentCommit: response.data[0] || null,
      previousCommit: response.data[1] || null,
    }
  })

// Fetch cleanough meta.json for a specific commit
export const fetchCleanoughMeta = createServerFn({ method: 'GET' })
  .inputValidator((data: { owner: string; repo: string; ref: string }) => data)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()
    const token = await auth.api.getAccessToken({
      body: {
        providerId: 'github',
      },
      headers,
    })

    const octokit = new Octokit({ auth: token.accessToken })

    try {
      const metaResponse = await octokit.rest.repos.getContent({
        owner: data.owner,
        repo: data.repo,
        path: '__cleanough/meta.json',
        ref: data.ref,
      })

      if (
        !Array.isArray(metaResponse.data) &&
        metaResponse.data.type === 'file'
      ) {
        const content = metaResponse.data.content
          ? Buffer.from(metaResponse.data.content, 'base64').toString('utf-8')
          : ''
        return JSON.parse(content)
      }
    } catch {
      // File doesn't exist, return null
    }

    return null
  })
