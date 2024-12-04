'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Theme, getTheme } from '@/lib/themes'

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getTheme('light'))

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme) {
      setTheme(getTheme(storedTheme))
    }
  }, [])

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem('theme', theme.name)
  }, [theme])

  const applyTheme = (theme: Theme) => {
    const root = window.document.documentElement
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })
  }

  return (
      <ThemeContext.Provider value={{ theme, setTheme: (name) => setTheme(getTheme(name)) }}>
        {children}
      </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

