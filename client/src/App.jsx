import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import SiteLayout from "./components/site/layout";

const Home = lazy(() => import("./pages/corporate/home"));
const About = lazy(() => import("./pages/corporate/about"));
const Brands = lazy(() => import("./pages/corporate/brands"));
const BrandDetail = lazy(() => import("./pages/corporate/brand-detail"));
const Manufacturing = lazy(() => import("./pages/corporate/manufacturing"));
const Distribution = lazy(() => import("./pages/corporate/distribution"));
const Partnerships = lazy(() => import("./pages/corporate/partnerships"));
const Contact = lazy(() => import("./pages/corporate/contact"));
const NotFound = lazy(() => import("./pages/corporate/not-found"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-[70vh]" />}>
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
      </Suspense>
    </>
  );
}
