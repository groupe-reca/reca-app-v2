import { NavLink, Outlet, useMatches } from 'react-router-dom'
import { useTheme } from '@/app/useTheme'
import { cn } from '@/lib/cn'
import { mobileNavItems, navSections } from './navigation'

interface RouteHandle {
  breadcrumb?: string
}

function useBreadcrumb(): string {
  const matches = useMatches()
  const last = matches.at(-1)
  const handle = last?.handle as RouteHandle | undefined
  return handle?.breadcrumb ?? 'Centre des opérations'
}

export function AppShell() {
  const breadcrumb = useBreadcrumb()
  const { preference, setPreference } = useTheme()

  return (
    <div className="bg-background text-text-primary min-h-screen">
      <div className="flex min-h-screen">
        <aside className="border-border bg-brand-navy-deep hidden w-60 shrink-0 flex-col border-r lg:flex">
          <div className="flex h-16 items-center gap-2 px-5">
            <span className="bg-brand-red flex size-8 items-center justify-center rounded-md text-sm font-bold text-white">
              R
            </span>
            <div className="leading-tight">
              <p className="text-body-sm font-bold text-white">RECA</p>
              <p className="text-caption text-white/60">Centre des opérations</p>
            </div>
          </div>

          <nav
            className="flex-1 space-y-6 overflow-y-auto px-3 pb-6"
            aria-label="Navigation principale"
          >
            {navSections.map((section) => (
              <div key={section.title}>
                <p className="text-caption px-2 pb-2 font-bold tracking-wider text-white/40 uppercase">
                  {section.title}
                </p>
                <ul className="space-y-0.5">
                  {section.items.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          cn(
                            'text-body-sm block rounded-md px-3 py-2 font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white',
                            isActive && 'bg-brand-red/15 font-semibold text-white',
                          )
                        }
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-border bg-surface flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4 lg:px-6">
            <p className="text-heading-sm text-text-primary truncate font-semibold">
              {breadcrumb}
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="border-border-strong bg-surface-raised text-body-sm text-text-muted hover:bg-surface-hover hidden h-9 items-center gap-2 rounded-md border px-3 sm:flex"
              >
                Rechercher…
                <kbd className="border-border-strong text-caption rounded border px-1.5 py-0.5">
                  Ctrl K
                </kbd>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPreference(preference === 'dark' ? 'light' : 'dark')
                }}
                aria-label="Changer de thème"
                className="border-border-strong text-text-secondary hover:bg-surface-hover flex size-9 items-center justify-center rounded-md border"
              >
                {preference === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
            <Outlet />
          </main>
        </div>
      </div>

      <nav
        aria-label="Navigation mobile"
        className="border-border bg-surface-raised fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'text-caption text-text-muted flex flex-col items-center justify-center gap-0.5 py-2 font-medium',
                isActive && 'text-brand-red',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
