import { Box } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'
import { DashboardNavbar } from '@/components/dashboard/dashboard-navbar'
import { ReposList } from '@/components/dashboard/repos-list'

export const Route = createFileRoute('/repos/')({
  component: ReposPage,
})

const repos = [
  {
    owner: 'cleanough',
    repo: 'demo',
    description: 'Cleanough Demo repository',
  },
  {
    owner: 'htmujahid',
    repo: 'barebone-reactivity',
    description: 'Barebone reactivity implementation',
  },
]

function ReposPage() {
  const { user } = Route.useRouteContext()

  return (
    <Box minH="100vh" bg="bg">
      <DashboardNavbar user={user} />
      <ReposList repos={repos} />
    </Box>
  )
}
