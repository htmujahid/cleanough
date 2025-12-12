'use client'

import { Box, Breadcrumb, Icon } from '@chakra-ui/react'
import { LuChevronRight } from 'react-icons/lu'

interface EditorBreadcrumbProps {
  filePath: string
}

export function EditorBreadcrumb({ filePath }: EditorBreadcrumbProps) {
  const segments = filePath.split('/').filter(Boolean)

  return (
    <Box
      px="3"
      py="1"
      borderBottomWidth="1px"
      borderColor="border.muted"
      bg="bg"
    >
      <Breadcrumb.Root size="sm">
        <Breadcrumb.List>
          {segments.map((segment, index) => (
            <Box key={index} display="inline-flex" alignItems="center">
              <Breadcrumb.Item>
                {index === segments.length - 1 ? (
                  <Breadcrumb.CurrentLink fontSize="xs" color="fg.muted">
                    {segment}
                  </Breadcrumb.CurrentLink>
                ) : (
                  <Breadcrumb.Link href="#" fontSize="xs" color="fg.muted">
                    {segment}
                  </Breadcrumb.Link>
                )}
              </Breadcrumb.Item>
              {index < segments.length - 1 && (
                <Breadcrumb.Separator>
                  <Icon boxSize="3" color="fg.muted">
                    <LuChevronRight />
                  </Icon>
                </Breadcrumb.Separator>
              )}
            </Box>
          ))}
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </Box>
  )
}
