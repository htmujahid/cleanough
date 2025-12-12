import { Box } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'
import { LandingNavbar } from '@/components/landing/landing-navbar'
import { LandingHero } from '@/components/landing/landing-hero'
import { LandingFeatures } from '@/components/landing/landing-features'
import { LandingUseCases } from '@/components/landing/landing-use-cases'
import { LandingCTA } from '@/components/landing/landing-cta'
import { LandingFooter } from '@/components/landing/landing-footer'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const { user } = Route.useRouteContext()

  return (
    <Box minH="100vh" bg="bg">
      <LandingNavbar user={user} />
      <LandingHero user={user} />
      <LandingFeatures />
      <LandingUseCases />
      <LandingCTA user={user} />
      <LandingFooter />
    </Box>
  )
}
