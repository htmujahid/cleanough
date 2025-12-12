import {
  Box,
  Card,
  Container,
  HStack,
  Heading,
  SimpleGrid,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react'

const useCases = [
  'Tutorial repositories with visual outputs',
  'Code evolution and refactoring demos',
  'Portfolio presentations',
  'Educational content with results',
  'DevOps showcases with terminal output',
]

export function LandingUseCases() {
  return (
    <Box py="20">
      <Container maxW="4xl">
        <SimpleGrid columns={{ base: 1, md: 2 }} gap="12" alignItems="center">
          <VStack align="start" gap="6">
            <Heading size="2xl">Built for developers who present</Heading>
            <Text color="fg.muted" fontSize="lg">
              Create compelling code narratives. Show before-and-after, explain
              complex changes, and let your commits tell the story.
            </Text>
            <VStack align="start" gap="3">
              {useCases.map((useCase) => (
                <HStack key={useCase} gap="3">
                  <Box w="1.5" h="1.5" bg="fg" rounded="full" />
                  <Text>{useCase}</Text>
                </HStack>
              ))}
            </VStack>
          </VStack>

          <Card.Root variant="outline" overflow="hidden">
            <Box bg="bg.subtle" px="4" py="2" borderBottomWidth="1px">
              <HStack gap="2">
                <Box w="3" h="3" bg="red.500" rounded="full" />
                <Box w="3" h="3" bg="yellow.500" rounded="full" />
                <Box w="3" h="3" bg="green.500" rounded="full" />
                <Spacer />
                <Text fontSize="xs" color="fg.muted" fontFamily="mono">
                  main
                </Text>
              </HStack>
            </Box>
            <Card.Body fontFamily="mono" fontSize="sm">
              <VStack align="start" gap="1">
                <Text color="green.500">+ function greet(name) {'{'}</Text>
                <Text color="green.500">
                  + &nbsp;&nbsp;return `Hello, ${'{'}name{'}'}`
                </Text>
                <Text color="green.500">+ {'}'}</Text>
                <Text color="fg.muted" mt="2">
                  // File 2/5 • Commit 3/12
                </Text>
              </VStack>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>
      </Container>
    </Box>
  )
}
