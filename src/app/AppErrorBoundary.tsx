import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class AppErrorBoundary extends Component<Props, State> {
  override state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[AppErrorBoundary]', error, info.componentStack)
  }

  override render() {
    if (this.state.error) {
      return (
        <div
          role="alert"
          className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 p-6 text-center text-slate-100"
        >
          <h1 className="text-xl font-semibold">Une erreur est survenue</h1>
          <p className="text-sm text-slate-400">
            Veuillez rafraîchir la page. Si le problème persiste, contactez le support.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}
