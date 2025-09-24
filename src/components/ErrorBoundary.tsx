import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('Widget Error Boundary caught an error:', error, errorInfo);
    
    // Store error info in state
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Track error in GA4 if available
    if (typeof window !== 'undefined' && window.gtag_rl) {
      try {
        window.gtag_rl('event', 'widget_error', {
          event_category: 'rainbow_relax_widget',
          event_label: 'error_boundary',
          custom_parameter_1: error.message,
          custom_parameter_2: errorInfo.componentStack?.split('\n')[0] || 'unknown_component'
        });
      } catch (gaError) {
        console.error('Failed to track error in GA4:', gaError);
      }
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '0.5rem',
          margin: '1rem',
          fontFamily: 'var(--font-global, Arial, sans-serif)',
          color: 'var(--color-text, #333)'
        }}>
          <h2 style={{ 
            color: '#dc3545', 
            marginBottom: '1rem',
            fontSize: '1.5rem'
          }}>
            Something went wrong
          </h2>
          <p style={{ 
            marginBottom: '1rem',
            fontSize: '1rem'
          }}>
            The breathing exercise widget encountered an error. Please try refreshing the page.
          </p>
          <button
            onClick={() => {
              // Reset error boundary state
              this.setState({ hasError: false, error: undefined, errorInfo: undefined });
              
              // Try to reinitialize widget
              if (typeof window !== 'undefined' && window.MyWidget) {
                try {
                  const config = window.myWidgetConfig;
                  if (config && window.MyWidget?.destroy) {
                    window.MyWidget.destroy();
                    setTimeout(() => {
                      window.MyWidget!.init(config);
                    }, 100);
                  }
                } catch (error) {
                  console.error('Failed to reinitialize widget:', error);
                }
              }
            }}
            style={{
              backgroundColor: 'var(--color-button, #4A7543)',
              color: 'var(--color-button-text, #FFFFFF)',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Try Again
          </button>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ 
              marginTop: '1rem', 
              textAlign: 'left',
              backgroundColor: '#f8f9fa',
              padding: '1rem',
              borderRadius: '0.25rem',
              border: '1px solid #dee2e6'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Error Details (Development Only)
              </summary>
              <pre style={{ 
                marginTop: '0.5rem', 
                fontSize: '0.875rem',
                color: '#dc3545',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
