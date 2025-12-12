import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server' // Import from server module
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { auth } from '@/lib/auth'

interface MyRouterContext {
  queryClient: QueryClient
}

const fetchRootData = createServerFn({ method: 'GET' }).handler(async () => {
  const headers = getRequestHeaders()
  const response = await auth.api.getSession({
    headers,
  })

  return {
    session: response?.session ?? null,
    user: response?.user ?? null,
  }
})

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Cleanough - Open Source Git-Powered Code Presentations',
      },
      {
        name: 'description',
        content:
          'Transform any GitHub repository into an interactive presentation. Browse code, step through commits, and showcase outputs in a VS Code-like interface.',
      },
      {
        name: 'keywords',
        content:
          'code presentation, git, github, code viewer, commit history, open source',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  beforeLoad: async () => fetchRootData(),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
