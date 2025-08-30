import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme/theme';
import { Button } from './Button';
// import { Alert } from './Alert';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      return <DefaultErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({ error, onReset }) => {
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    padding: spacing.xl,
    textAlign: 'center',
  };

  const iconStyles: React.CSSProperties = {
    width: '80px',
    height: '80px',
    color: colors.error,
    marginBottom: spacing.lg,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  };

  const messageStyles: React.CSSProperties = {
    fontSize: fontSize.md,
    color: colors.textLight,
    marginBottom: spacing.xl,
    maxWidth: '600px',
  };

  const errorDetailsStyles: React.CSSProperties = {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    maxWidth: '600px',
    width: '100%',
    textAlign: 'left',
  };

  const errorNameStyles: React.CSSProperties = {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.error,
    marginBottom: spacing.xs,
  };

  const errorMessageStyles: React.CSSProperties = {
    fontSize: fontSize.sm,
    color: colors.textLight,
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  };

  return (
    <div style={containerStyles}>
      <svg style={iconStyles} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
      
      <h1 style={titleStyles}>Oops! Something went wrong</h1>
      
      <p style={messageStyles}>
        We're sorry for the inconvenience. An unexpected error has occurred.
        Please try refreshing the page or contact support if the problem persists.
      </p>
      
      <Button onClick={onReset} variant="primary" size="large">
        Try Again
      </Button>
      
      {error && (
        <div style={errorDetailsStyles}>
          <div style={errorNameStyles}>{error.name}</div>
          <div style={errorMessageStyles}>{error.message}</div>
        </div>
      )}
    </div>
  );
};

// Hook for error handling in functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  const resetError = () => setError(null);
  const captureError = (error: Error) => setError(error);

  return { resetError, captureError };
};

// Higher-order component for error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  return (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );
}