import React from 'react';

class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Admin Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-admin-brand-cream flex flex-col items-center justify-center p-12 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center text-red-600 mb-8 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          </div>
          <h1 className="text-4xl font-black text-secondary mb-4 tracking-tight">Something went wrong</h1>
          <p className="text-gray-500 max-w-md font-medium leading-relaxed mb-8">
            The Admin Portal encountered a critical error during boot. This may be due to malformed data or a component crash.
          </p>
          <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm text-left max-w-2xl w-full overflow-auto max-h-[300px]">
            <p className="text-red-600 font-black text-xs uppercase tracking-widest mb-2">Error Details:</p>
            <pre className="text-xs font-mono text-gray-600 whitespace-pre-wrap">
              {this.state.error?.toString()}
              {"\n\n"}
              {this.state.errorInfo?.componentStack}
            </pre>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-10 px-8 py-4 bg-admin-secondary text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:scale-105 transition-all"
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AdminErrorBoundary;
