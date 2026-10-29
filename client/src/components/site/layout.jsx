import { Outlet } from "react-router-dom";
import SiteHeader from "./header";
import SiteFooter from "./footer";
import PromoPopup from "./promo-popup";

export default function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <PromoPopup />
    </div>
  );
}
