import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#ffebee', color: '#c62828', height: '100vh', overflow: 'auto' }}>
          <h2>Something went wrong in the UI.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Click to view error details</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
          <button onClick={() => window.location.href = '/admin'} style={{ marginTop: '20px', padding: '10px 20px', background: '#c62828', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Go back to Dashboard
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
