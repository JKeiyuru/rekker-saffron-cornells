import { useEffect } from "react";
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

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <>
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
    </>
  );
}
