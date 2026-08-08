// LoginPage is deliberately NOT re-exported here — it's only consumed
// via a direct lazy import in src/routes/lazyPages.tsx. Re-exporting it
// from this barrel would let the bundler fold it back into the eager
// chunk, since RequireAuth (below) is imported eagerly from this same
// file elsewhere.
export { RequireAuth } from './components/RequireAuth'
export { useLogout } from './hooks/useLogout'
