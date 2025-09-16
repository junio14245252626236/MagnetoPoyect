'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import type { PropsWithChildren } from 'react'

export function ThemeProvider({ children, ...props }: PropsWithChildren<ThemeProviderProps>) {
  return (
    <SessionProvider>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </SessionProvider>
  )
}
