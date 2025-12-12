import {
  Box,
  Card,
  Container,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'
import { LuFolderTree, LuHistory, LuMonitor } from 'react-icons/lu'

const features = [
  {
    icon: LuFolderTree,
    title: 'Explorer Mode',
    description:
      'Browse repository files with a familiar VS Code-style interface. Syntax highlighting for 50+ languages, media preview, and tabbed editing.',
  },
  {
    icon: LuHistory,
    title: 'History Mode',
    description:
      'Step through commits like slides. View diffs, navigate between changes, and present code evolution with precision controls.',
  },
  {
    icon: LuMonitor,
    title: 'Output Mode',
    description:
      'Showcase execution results alongside code. Display terminal outputs, generated images, and custom artifacts per commit.',
  },
]

export function LandingFeatures() {
  return (
    <Box py="20" bg="bg.muted">
      <Container maxW="5xl">
        <VStack gap="12">
          <VStack gap="4" textAlign="center">
            <Heading size="2xl">Three powerful modes</Heading>
            <Text color="fg.muted" fontSize="lg" maxW="2xl">
              Whether you're exploring, presenting, or demonstrating results,
              Cleanough adapts to your workflow.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap="6" w="full">
            {features.map((feature) => (
              <Card.Root key={feature.title} variant="elevated">
                <Card.Body>
                  <VStack align="start" gap="4">
                    <Box p="3" bg="bg.muted" rounded="lg">
                      <Icon boxSize="6" color="fg">
                        <feature.icon />
                      </Icon>
                    </Box>
                    <Heading size="lg">{feature.title}</Heading>
                    <Text color="fg.muted">{feature.description}</Text>
                  </VStack>
                </Card.Body>
              </Card.Root>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
}
