import {
  Box,
  Container,
  Flex,
  HStack,
  Icon,
  Spacer,
  Text,
} from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { LuCode } from 'react-icons/lu'

export function LandingFooter() {
  return (
    <Box py="8" borderTopWidth="1px" borderColor="border.muted">
      <Container maxW="6xl">
        <Flex direction={{ base: 'column', md: 'row' }} align="center" gap="4">
          <Link to="/">
            <HStack gap="2" userSelect="none">
              <Icon boxSize="6" color="fg.muted">
                <LuCode />
              </Icon>
              <Text fontWeight="bold" fontSize="lg" fontFamily="mono" color="fg.muted">
                Cleanough
              </Text>
            </HStack>
          </Link>
          <Spacer />
          <Text color="fg.muted" fontSize="sm">
            Open source git-based code presentation tool
          </Text>
        </Flex>
      </Container>
    </Box>
  )
}
