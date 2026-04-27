import React from "react";

type Props = { children?: React.ReactNode };
type State = { error: Error | null };

export class CanvasErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Canvas error:", error, info);
  }

  handleReload = () => {
    this.setState({ error: null });
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <div className="absolute inset-0 flex items-center justify-center p-8 z-20">
          <div className="bg-white/90 dark:bg-neutral-800/95 rounded-md shadow-lg p-5 max-w-sm text-center">
            <h2 className="text-base font-bold mb-2 text-gray-900 dark:text-neutral-100">3D scene crashed</h2>
            <p className="text-xs text-gray-700 dark:text-neutral-300 mb-3 break-words">
              {this.state.error.message || "Unknown error"}
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="px-3 py-1.5 rounded bg-gray-800 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

