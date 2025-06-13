// client/src/components/common/check-auth.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function CheckAuth({ children }) {
  const location = useLocation();
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);
  
  // Debug logs - remove after fixing
  console.log('CheckAuth Debug:', {
    isAuthenticated,
    user,
    isLoading,
    pathname: location.pathname,
    userRole: user?.role
  });

  // Show loading spinner while auth state is being determined
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isAuthPage = location.pathname.startsWith("/auth");
  const isAdminPage = location.pathname.startsWith("/admin");
  const isShopPage = location.pathname.startsWith("/shop");

  // Root path redirect
  if (location.pathname === "/") {
    return <Navigate to={
      !isAuthenticated ? "/auth/login" : 
      user?.role === "admin" ? "/admin/dashboard" : "/shop/home"
    } replace />;
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthPage) {
    return <Navigate to={
      user?.role === "admin" ? "/admin/dashboard" : "/shop/home"
    } replace />;
  }

  // Protect admin routes
  if (isAuthenticated && user?.role !== "admin" && isAdminPage) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Redirect admin from shop to dashboard
  if (isAuthenticated && user?.role === "admin" && isShopPage) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Protect all routes when not authenticated
  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default CheckAuth;