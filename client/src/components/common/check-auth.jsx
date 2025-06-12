// client/src/components/common/check-auth.jsx
import { Navigate, useLocation } from "react-router-dom";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, setFirebaseUser } from "@/store/auth-slice";

function CheckAuth({ children }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const [authStatus, setAuthStatus] = useState({
    checked: false,
    authenticated: false,
    user: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const response = await fetch("/api/auth/check-auth", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setAuthStatus({
              checked: true,
              authenticated: true,
              user: userData.user
            });
            
            // Update both user states
            dispatch(setUser(userData.user));
            dispatch(setFirebaseUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              emailVerified: firebaseUser.emailVerified,
              // Add other needed Firebase user properties
            }));
          } else {
            throw new Error("Failed to verify authentication");
          }
        } catch (error) {
          console.error("Auth verification error:", error);
          setAuthStatus({
            checked: true,
            authenticated: false,
            user: null
          });
          dispatch(setUser(null));
          dispatch(setFirebaseUser(null));
        }
      } else {
        setAuthStatus({
          checked: true,
          authenticated: false,
          user: null
        });
        dispatch(setUser(null));
        dispatch(setFirebaseUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (!authStatus.checked) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const { authenticated, user } = authStatus;
  const isAuthPage = location.pathname.startsWith("/auth");
  const isAdminPage = location.pathname.startsWith("/admin");
  const isShopPage = location.pathname.startsWith("/shop");

  // Root path redirect
  if (location.pathname === "/") {
    return <Navigate to={
      !authenticated ? "/auth/login" : 
      user?.role === "admin" ? "/admin/dashboard" : "/shop/home"
    } replace />;
  }

  // Redirect authenticated users away from auth pages
  if (authenticated && isAuthPage) {
    return <Navigate to={
      user?.role === "admin" ? "/admin/dashboard" : "/shop/home"
    } replace />;
  }

  // Protect admin routes
  if (authenticated && user?.role !== "admin" && isAdminPage) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Redirect admin from shop to dashboard
  if (authenticated && user?.role === "admin" && isShopPage) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Protect all routes when not authenticated
  if (!authenticated && !isAuthPage) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default CheckAuth;