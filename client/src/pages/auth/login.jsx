//client/src/pages/auth/login.jsx
import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
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

  // Helper function to handle successful login navigation
  const handleSuccessfulLogin = (userData, message = "Logged in successfully!") => {
    toast({ title: message });
    
    // Don't manually navigate - let the auth state change handle it
    // The Firebase auth state listener will trigger navigation
    console.log('Login successful for user:', userData);
  };

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Try Firebase authentication first
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      console.log('Firebase login successful:', userCredential.user.email);
      // Don't handle navigation here - the auth state listener will handle it
      handleSuccessfulLogin({ email: userCredential.user.email });
      
    } catch (firebaseError) {
      console.error('Firebase login error:', firebaseError);
      
      // If Firebase fails, try traditional backend login
      try {
        const response = await dispatch(loginUser(formData));
        
        if (response?.payload?.success) {
          handleSuccessfulLogin(response.payload.user);
        } else {
          throw new Error(response?.payload?.message || 'Backend login failed');
        }
      } catch (backendError) {
        console.error('Backend login error:', backendError);
        
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

  // Handle Google/Social login success - simplified
  const handleSocialLoginSuccess = (userData) => {
    handleSuccessfulLogin(userData.user, "Logged in successfully!");
  };

  // Handle social login error
  const handleSocialLoginError = (error) => {
    toast({
      title: "Authentication failed",
      description: error,
      variant: "destructive"
    });
  };

  // If already authenticated, don't show login form
  if (isAuthenticated && user) {
    const targetRoute = user.role === 'admin' ? '/admin/dashboard' : '/shop/home';
    navigate(targetRoute, { replace: true });
    return null;
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