import { useCallback, useEffect, useState } from 'react'

// docs/01-Design-System.md §5.3
export type ThemePreference = 'system' | 'dark' | 'light'

const STORAGE_KEY = 'reca.theme'

function resolveTheme(preference: ThemePreference): 'dark' | 'light' {
  if (preference === 'system') {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  }
  return preference
}

function applyTheme(preference: ThemePreference): void {
  document.documentElement.dataset.theme = resolveTheme(preference)
}

export function useTheme(): {
  preference: ThemePreference
  setPreference: (preference: ThemePreference) => void
} {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'dark' || stored === 'light' || stored === 'system'
      ? stored
      : 'dark'
  })

  useEffect(() => {
    applyTheme(preference)
  }, [preference])

  const setPreference = useCallback((next: ThemePreference) => {
    localStorage.setItem(STORAGE_KEY, next)
    setPreferenceState(next)
  }, [])

  return { preference, setPreference }
}
