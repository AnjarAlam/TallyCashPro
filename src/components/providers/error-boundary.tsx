/**
 * Error Boundary Component for Safari/iPhone compatibility
 * Catches and handles runtime errors gracefully
 */

"use client";

import React, { Component, ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console for debugging
    console.error("Error caught by boundary:", error);
    console.error("Error info:", errorInfo);

    // Check if this is a storage-related error
    if (
      error.message.includes("localStorage") ||
      error.message.includes("sessionStorage") ||
      error.message.includes("storage is not defined")
    ) {
      // Reload page to try again with fallback
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Application Error
            </h1>
            <p className="text-gray-700 mb-6">
              Something went wrong. The app will refresh automatically in a few seconds.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="text-left bg-white p-4 rounded border border-red-200 mb-4 text-sm">
                <summary className="font-bold cursor-pointer text-red-600 mb-2">
                  Error Details (dev only)
                </summary>
                <pre className="text-xs overflow-auto max-h-40">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <p className="text-sm text-gray-500">
              If the problem persists, please clear your browser cache and try again.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
