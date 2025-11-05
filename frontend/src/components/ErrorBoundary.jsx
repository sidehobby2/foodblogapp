import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    console.error("Error Boundary caught an error:", error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-600" size={40} />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4 font-serif">
              Something went wrong
            </h1>

            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. This might be due to a network
              issue or a problem with the application.
            </p>

            {this.state.error && (
              <details className="text-left mb-6 bg-gray-50 p-4 rounded-lg">
                <summary className="cursor-pointer font-medium text-gray-700">
                  Error Details
                </summary>
                <pre className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo.componentStack && (
                  <pre className="text-sm text-gray-500 mt-2 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRefresh}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition duration-200 flex items-center justify-center space-x-2 font-medium"
              >
                <RefreshCw size={18} />
                <span>Refresh Page</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-200 flex items-center justify-center space-x-2 font-medium"
              >
                <Home size={18} />
                <span>Go Home</span>
              </button>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <p>If the problem persists, please check:</p>
              <ul className="mt-2 space-y-1">
                <li>• Your internet connection</li>
                <li>• Browser console for errors</li>
                <li>• API server status</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
