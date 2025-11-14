/* eslint-disable no-unused-vars */
// client/src/App.jsx - Optimized for Performance and 404 Fixes
import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, setFirebaseUser, clearAuth, syncFirebaseAuth } from "./store/auth-slice";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Layout Components
import AuthLayout from "./components/auth/layout";
import AdminLayout from "./components/admin-view/layout";
import ShoppingLayout from "./components/shopping-view/layout";
import CheckAuth from "./components/common/check-auth";
import LuxuryLoader from "./components/common/spectacular-loader";

// Pages - Lazy Load for Performance
const AuthLogin = lazy(() => import("./pages/auth/login"));
const AuthRegister = lazy(() => import("./pages/auth/register"));
const AdminDashboard = lazy(() => import("./pages/admin-view/dashboard"));
const AdminProducts = lazy(() => import("./pages/admin-view/products"));
const AdminOrders = lazy(() => import("./pages/admin-view/orders"));
const AdminFeatures = lazy(() => import("./pages/admin-view/features"));
const LuxuryHome = lazy(() => import("./pages/shopping-view/home"));
const ShoppingListing = lazy(() => import("./pages/shopping-view/listing"));
const ShoppingCheckout = lazy(() => import("./pages/shopping-view/checkout"));
const ShoppingAccount = lazy(() => import("./pages/shopping-view/account"));
const PaypalReturnPage = lazy(() => import("./pages/shopping-view/paypal-return"));
const PaymentSuccessPage = lazy(() => import("./pages/shopping-view/payment-success"));
const SearchProducts = lazy(() => import("./pages/shopping-view/search"));
const About = lazy(() => import("./pages/shopping-view/about"));
const Services = lazy(() => import("./pages/shopping-view/services"));
const Distributors = lazy(() => import("./pages/shopping-view/distributors"));
const Contact = lazy(() => import("./pages/shopping-view/contact"));
const SaffronBrand = lazy(() => import("./pages/shopping-view/brands/saffron"));
const CornellsBrand = lazy(() => import("./pages/shopping-view/brands/cornells"));
const BrandsOverview = lazy(() => import("./pages/shopping-view/brands-overview"));
const NotFound = lazy(() => import("./pages/not-found"));
const UnauthPage = lazy(() => import("./pages/unauth-page"));

// Loading Fallback Component
function LoadingFallback() {
  return <LuxuryLoader />;
}

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, [pathname]);

  return null;
}

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  // Firebase Authentication Setup
  useEffect(() => {
    let mounted = true;

    console.log('🚀 App: Setting up Firebase auth listener...');

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!mounted) return;

      try {
        if (firebaseUser) {
          console.log('🔥 Firebase user detected:', firebaseUser.email);
          
          dispatch(setFirebaseUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName
          }));

          console.log('🔄 Syncing Firebase user with backend...');
          const syncResult = await dispatch(syncFirebaseAuth(firebaseUser));
          
          console.log('🔄 Firebase sync result:', syncResult.payload?.success);
          
        } else {
          console.log('🚫 No Firebase user detected');
          
          dispatch(setFirebaseUser(null));
          
          console.log('🔍 Checking for traditional auth...');
          await dispatch(checkAuth());
        }
      } catch (error) {
        console.error('❌ Auth verification error:', error);
        if (mounted) {
          dispatch(clearAuth());
        }
      } finally {
        if (mounted) {
          setFirebaseInitialized(true);
        }
      }
    });

    return () => {
      console.log('🧹 App: Cleaning up Firebase auth listener...');
      mounted = false;
      unsubscribe();
    };
  }, [dispatch]);

  // Show loader while initializing
  if (!firebaseInitialized || isLoading) {
    console.log('⏳ App: Showing loader...', { firebaseInitialized, isLoading });
    return <LuxuryLoader />;
  }

  console.log('🎯 App render - Auth State:', { 
    isLoading, 
    isAuthenticated, 
    userRole: user?.role,
    userEmail: user?.email || user?.userName,
    firebaseInitialized 
  });

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Root redirect */}
          <Route
            path="/"
            element={
              <CheckAuth
                isAuthenticated={isAuthenticated}
                user={user}
              ></CheckAuth>
            }
          />

          {/* Auth Routes */}
          <Route
            path="/auth"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AuthLayout />
              </CheckAuth>
            }
          >
            <Route path="login" element={<AuthLogin />} />
            <Route path="register" element={<AuthRegister />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AdminLayout />
              </CheckAuth>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="features" element={<AdminFeatures />} />
          </Route>

          {/* Shopping Routes */}
          <Route path="/shop" element={<ShoppingLayout />}>
            {/* Public Routes */}
            <Route path="home" element={<LuxuryHome />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="distributors" element={<Distributors />} />
            <Route path="contact" element={<Contact />} />
            <Route path="brands" element={<BrandsOverview />} />
            <Route path="brands/saffron" element={<SaffronBrand />} />
            <Route path="brands/cornells" element={<CornellsBrand />} />
            <Route path="listing" element={<ShoppingListing />} />
            <Route path="search" element={<SearchProducts />} />
            
            {/* Protected Routes */}
            <Route
              path="checkout"
              element={
                <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                  <ShoppingCheckout />
                </CheckAuth>
              }
            />
            <Route
              path="account"
              element={
                <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                  <ShoppingAccount />
                </CheckAuth>
              }
            />
            <Route
              path="paypal-return"
              element={
                <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                  <PaypalReturnPage />
                </CheckAuth>
              }
            />
            <Route
              path="payment-success"
              element={
                <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                  <PaymentSuccessPage />
                </CheckAuth>
              }
            />
          </Route>

          {/* Error Routes */}
          <Route path="/unauth-page" element={<UnauthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;