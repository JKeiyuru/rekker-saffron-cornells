/* eslint-disable no-unused-vars */
// client/src/App.jsx - Rekker Professional Company Website
import { Route, Routes, useLocation } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { checkAuth, setFirebaseUser, clearAuth, syncFirebaseAuth } from "./store/auth-slice";
import PaypalReturnPage from "./pages/shopping-view/paypal-return";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import SpectacularLoader from "./components/common/spectacular-loader";

// Rekker-specific pages
import About from "./pages/shopping-view/about";
import Services from "./pages/shopping-view/services";
import Distributors from "./pages/shopping-view/distributors";
import Contact from "./pages/shopping-view/contact.jsx";
import SaffronBrand from "./pages/shopping-view/brands/saffron";
import CornellsBrand from "./pages/shopping-view/brands/cornells";
import BrandsOverview from "./pages/shopping-view/brands-overview";

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" // Use "instant" for immediate scroll, "smooth" for animated
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

  useEffect(() => {
    let mounted = true;

    console.log('🚀 App: Setting up Firebase auth listener...');

    // Firebase Auth State Listener
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

  if (!firebaseInitialized || isLoading) {
    console.log('⏳ App: Showing loader...', { firebaseInitialized, isLoading });
    return <SpectacularLoader />;
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
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        />
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
        {/* Public Shopping Routes - No Auth Required for Browsing */}
        <Route path="/shop" element={<ShoppingLayout />}>
          <Route path="home" element={<ShoppingHome />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="distributors" element={<Distributors />} />
          <Route path="contact" element={<Contact />} />
          <Route path="brands" element={<BrandsOverview />} />
          <Route path="brands/saffron" element={<SaffronBrand />} />
          <Route path="brands/cornells" element={<CornellsBrand />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="search" element={<SearchProducts />} />
          
          {/* Protected Routes - Auth Required */}
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
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;