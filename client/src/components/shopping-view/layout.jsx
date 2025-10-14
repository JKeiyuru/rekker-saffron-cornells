// client/src/components/shopping-view/layout.jsx - Rekker Shopping Layout
import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-white overflow-hidden min-h-screen">
      {/* Rekker Header */}
      <ShoppingHeader />
      
      {/* Main Content */}
      <main className="flex flex-col w-full flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default ShoppingLayout;