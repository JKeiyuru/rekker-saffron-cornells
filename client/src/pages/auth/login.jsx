/* eslint-disable no-unused-vars */
//client/src/pages/auth/login.jsx
import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser, syncFirebaseAuth } from "@/store/auth-slice";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { AuthProviders } from "@/components/auth/auth-providers";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Navigate when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const targetRoute = user.role === 'admin' ? '/admin/dashboard' : '/shop/home';
      console.log('🎯 Navigation triggered - User role:', user.role, '-> Route:', targetRoute);
      navigate(targetRoute, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Helper function to handle successful login navigation
  const handleSuccessfulLogin = (userData, message = "Logged in successfully!") => {
    toast({ title: message });
    console.log('✅ Login successful for user:', {
      email: userData.email || userData.userName,
      role: userData.role
    });
  };

  // Helper function to manually sync Firebase user with backend
  const syncFirebaseUserWithBackend = async (firebaseUser) => {
    try {
      console.log('🔄 Manual sync - Getting fresh Firebase token...');
      const idToken = await firebaseUser.getIdToken(true); // Force refresh
      console.log('🎫 Got fresh Firebase token, length:', idToken.length);

      // Try firebase-login first (for existing users)
      console.log('🔐 Trying firebase-login endpoint...');
      const loginResponse = await fetch('/api/auth/firebase-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          email: firebaseUser.email,
          firebaseUid: firebaseUser.uid
        })
      });

      const loginData = await loginResponse.json();
      console.log('🔐 Firebase login response:', loginData);

      if (loginData.success) {
        // Dispatch to Redux to update auth state
        dispatch({
          type: 'auth/setUser',
          payload: {
            isAuthenticated: true,
            user: loginData.user
          }
        });
        return loginData;
      } else if (loginResponse.status === 404) {
        // User doesn't exist, try social-login to create account
        console.log('👤 User not found, trying social-login...');
        const socialResponse = await fetch('/api/auth/social-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          }
        });

        const socialData = await socialResponse.json();
        console.log('🎉 Social login response:', socialData);

        if (socialData.success) {
          // Dispatch to Redux to update auth state
          dispatch({
            type: 'auth/setUser',
            payload: {
              isAuthenticated: true,
              user: socialData.user
            }
          });
          return socialData;
        } else {
          throw new Error(socialData.message || 'Social login failed');
        }
      } else {
        throw new Error(loginData.message || 'Firebase login failed');
      }
    } catch (error) {
      console.error('❌ Manual sync error:', error);
      throw error;
    }
  };

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      console.log('🔐 Starting Firebase authentication...');
      
      // Firebase authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      console.log('✅ Firebase login successful:', userCredential.user.email);
      
      // Instead of relying on the auth state listener, manually sync here
      try {
        const syncResult = await syncFirebaseUserWithBackend(userCredential.user);
        console.log('✅ Manual sync successful:', syncResult);
        
        handleSuccessfulLogin(syncResult.user);
        // Navigation will be handled by useEffect when Redux state updates
        
      } catch (syncError) {
        console.error('❌ Manual sync failed:', syncError);
        // Firebase auth succeeded but backend sync failed
        throw new Error('Login successful but account sync failed. Please try again.');
      }
      
    } catch (firebaseError) {
      console.error('❌ Firebase login error:', firebaseError);
      
      // If Firebase fails, try traditional backend login
      try {
        console.log('🔄 Trying traditional backend login...');
        const response = await dispatch(loginUser({ formData }));
        
        if (response?.payload?.success) {
          handleSuccessfulLogin(response.payload.user);
          // Navigation will be handled by useEffect
        } else {
          throw new Error(response?.payload?.message || 'Backend login failed');
        }
      } catch (backendError) {
        console.error('❌ Backend login error:', backendError);
        
        // Provide specific error messages
        let errorMessage = "Login failed. Please check your credentials and try again.";
        
        if (firebaseError.code === 'auth/user-not-found') {
          errorMessage = "No account found with this email. Please register first.";
        } else if (firebaseError.code === 'auth/wrong-password') {
          errorMessage = "Incorrect password. Please try again.";
        } else if (firebaseError.code === 'auth/invalid-email') {
          errorMessage = "Invalid email address format.";
        } else if (firebaseError.code === 'auth/user-disabled') {
          errorMessage = "This account has been disabled. Please contact support.";
        } else if (firebaseError.code === 'auth/invalid-credential') {
          errorMessage = "Invalid credentials. Please check your email and password.";
        } else if (firebaseError.message) {
          errorMessage = firebaseError.message;
        }

        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Google/Social login success
  const handleSocialLoginSuccess = async (userData) => {
    console.log('🎉 Social login successful:', userData);
    
    // The AuthProviders component should handle the backend sync,
    // but we can add a fallback here if needed
    if (userData.user) {
      handleSuccessfulLogin(userData.user, "Logged in successfully!");
      // Navigation will be handled by useEffect when Redux state updates
    } else {
      console.error('❌ Social login userData missing user object');
      toast({
        title: "Login incomplete",
        description: "Please try logging in again.",
        variant: "destructive"
      });
    }
  };

  // Handle social login error
  const handleSocialLoginError = (error) => {
    console.error('❌ Social login error:', error);
    toast({
      title: "Authentication failed",
      description: error,
      variant: "destructive"
    });
  };

  // Don't render the form if already authenticated
  if (isAuthenticated && user) {
    console.log('👤 User already authenticated, hiding login form');
    return null; // Let useEffect handle navigation
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don&apos;t have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      
      <CommonForm
        formControls={loginFormControls}
        buttonText={isLoading ? "Signing In..." : "Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        disabled={isLoading}
      />
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <AuthProviders 
        onSuccess={handleSocialLoginSuccess}
        onError={handleSocialLoginError}
      />
    </div>
  );
}

export default AuthLogin;