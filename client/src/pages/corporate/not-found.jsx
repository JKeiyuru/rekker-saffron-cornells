import { Link } from "react-router-dom";
import Seo from "@/components/site/seo";

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found | Rekker" description="The page you were looking for does not exist on rekker.co.ke." path="/404" />
      <div className="container-rk flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <div className="font-display text-7xl font-bold text-primary">404</div>
        <h1 className="display mt-4 text-3xl">This page doesn't exist.</h1>
        <Link to="/" className="mt-8 bg-ink px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-primary">
          Back home
        </Link>
      </div>
    </>
  );
}
