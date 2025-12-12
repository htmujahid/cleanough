'use client'

import {
  ChakraProvider as ChakraUiProvider,
  createSystem,
  defaultConfig,
  defineConfig,
} from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'
import type { ColorModeProviderProps } from './color-mode'

const config = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: {
            value: { _light: '{colors.white}', _dark: '#1e1e1e' },
          },
        },
        border: {
          muted: {
            value: { _light: '{colors.gray.200}', _dark: '#3e3e3e' },
          },
        },
      },
    },
  },
})

const system = createSystem(defaultConfig, config)

export function ChakraProvider(props: ColorModeProviderProps) {
  return (
    <ChakraUiProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraUiProvider>
  )
}
