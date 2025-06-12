//client/src/pages/auth/login.jsx
import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser, setUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
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

  // Helper function to handle successful login navigation
  const handleSuccessfulLogin = (user, message = "Logged in successfully!") => {
    toast({ title: message });
    
    // Update Redux state
    dispatch(setUser(user));
    
    // Navigate with delay to allow state updates
    const targetRoute = user?.role === 'admin' ? '/admin/dashboard' : '/shop/home';
    console.log('Navigating to:', targetRoute);
    
    setTimeout(() => {
      navigate(targetRoute, { replace: true });
    }, 100);
  };

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Try traditional login first
      const response = await dispatch(loginUser(formData));
      
      if (response?.payload?.success) {
        handleSuccessfulLogin(response.payload.user);
        return; // Exit early to avoid Firebase auth attempt
      }

      // If traditional login fails, try Firebase authentication
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        
        // Get Firebase ID token and send to backend
        const idToken = await userCredential.user.getIdToken();
        
        const backendResponse = await fetch('https://nemmoh-ecommerce-server.onrender.com/api/auth/firebase-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({
            email: formData.email,
            firebaseUid: userCredential.user.uid
          })
        });

        // Check if response is JSON
        const contentType = backendResponse.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const textResponse = await backendResponse.text();
          console.error('Non-JSON response:', textResponse);
          throw new Error('Server returned non-JSON response');
        }

        const backendData = await backendResponse.json();
        
        if (backendData.success) {
          handleSuccessfulLogin(backendData.user);
        } else {
          throw new Error(backendData.message || 'Backend authentication failed');
        }
        
      } catch (firebaseError) {
        console.error('Firebase login error:', firebaseError);
        
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
    } catch (error) {
      console.error('General login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Google/Social login success
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