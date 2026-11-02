import React, { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Trash2 } from "lucide-react";

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Allôresto Uncaught UI Error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCache = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn("Could not clear storage:", e);
    }
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white">
                Allôresto — Redémarrage rapide
              </h1>
              <p className="text-sm text-slate-400">
                Une interruption d'affichage est survenue. Vos données et commandes restent en sécurité.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-left">
                <p className="text-xs font-mono text-orange-400 font-semibold mb-1">
                  Détail technique :
                </p>
                <p className="text-xs font-mono text-slate-300 break-words">
                  {this.state.error.message || String(this.state.error)}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-sm transition-colors shadow-lg shadow-orange-600/20 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Actualiser
              </button>
              <button
                type="button"
                onClick={this.handleResetCache}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-colors border border-slate-700 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Vider cache
              </button>
            </div>

            <div className="pt-2 text-xs text-slate-500">
              Khady's Food &amp; Event · Niamey, Niger 🇳🇪
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
