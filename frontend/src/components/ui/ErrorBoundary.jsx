import { Component } from "react";
import Button from "./Button";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  resetToLogin = () => {
    localStorage.removeItem("finora_auth");
    window.location.assign("/login");
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-slate-950 dark:bg-ink dark:text-white">
        <section className="premium-surface max-w-lg p-6 text-center">
          <p className="label">Application recovery</p>
          <h1 className="mt-2 text-3xl font-black">Something interrupted this view.</h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">
            Your session has been cleared so you can return to a stable login screen.
          </p>
          <Button className="mt-6" onClick={this.resetToLogin}>Return to login</Button>
        </section>
      </main>
    );
  }
}

export default ErrorBoundary;
