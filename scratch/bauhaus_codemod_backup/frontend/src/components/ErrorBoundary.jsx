import React from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldCheck } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('LibraMind ErrorBoundary caught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            backgroundColor: 'var(--cream, #FAF8F1)'
          }}
        >
          <div
            className="bio-card"
            style={{
              width: '540px',
              maxWidth: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '36px',
              boxShadow: '0 12px 32px rgba(52, 78, 65, 0.12)',
              border: '1px solid rgba(82, 115, 77, 0.2)',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '18px',
                backgroundColor: 'rgba(217, 119, 6, 0.12)',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px'
              }}
            >
              <AlertTriangle size={32} />
            </div>

            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--soft-sage-light, #E8EDE6)',
                color: 'var(--forest-dark, #24352B)',
                fontSize: '0.72rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '4px 12px',
                borderRadius: '12px',
                marginBottom: '10px'
              }}
            >
              System Resilience Shield Active
            </span>

            <h2
              style={{
                fontSize: '1.65rem',
                color: 'var(--forest-dark, #24352B)',
                marginBottom: '8px'
              }}
            >
              Something Unexpected Happened
            </h2>

            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--muted-text, #6C7A71)',
                lineHeight: 1.6,
                marginBottom: '20px'
              }}
            >
              Don't worry! Your library account, loan records, and session data are completely safe and secure in the database.
            </p>

            {this.state.error && (
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  color: '#92400E',
                  fontSize: '0.82rem',
                  textAlign: 'left',
                  marginBottom: '24px',
                  fontFamily: 'monospace',
                  overflowX: 'auto',
                  maxHeight: '120px'
                }}
              >
                <strong>Error:</strong> {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={this.handleReload}
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}
              >
                <RefreshCw size={16} />
                Refresh Page
              </button>
              <button
                onClick={this.handleReset}
                className="btn btn-outline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}
              >
                <Home size={16} />
                Return to Sanctuary Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
