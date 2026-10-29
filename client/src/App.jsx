import { Component, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import SiteLayout from "./components/site/layout";

import Home from "./pages/corporate/home";
import About from "./pages/corporate/about";
import Brands from "./pages/corporate/brands";
import BrandDetail from "./pages/corporate/brand-detail";
import Manufacturing from "./pages/corporate/manufacturing";
import Distribution from "./pages/corporate/distribution";
import Partnerships from "./pages/corporate/partnerships";
import Contact from "./pages/corporate/contact";
import NotFound from "./pages/corporate/not-found";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container-rk py-20 text-center">
          <h2 className="text-2xl font-bold text-primary">Something went wrong</h2>
          <p className="mt-2 text-sm text-muted-foreground">{this.state.error?.message || "An unexpected error occurred."}</p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = "/";
            }}
            className="mt-6 inline-flex bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white"
          >
            Return to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/brands/:slug" element={<BrandDetail />} />
            <Route path="/manufacturing" element={<Manufacturing />} />
            <Route path="/distribution" element={<Distribution />} />
            <Route path="/partnerships" element={<Partnerships />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
    </ErrorBoundary>
  );
}
