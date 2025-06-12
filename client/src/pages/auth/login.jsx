//client/src/pages/auth/login.jsx
import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
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

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      // First, try traditional login (for existing users)
      const response = await dispatch(loginUser(formData));
      
      if (response?.payload?.success) {
        toast({
          title: "Logged in successfully!",
        });
        // Navigate based on user role
        const userRole = response.payload.user?.role;
        navigate(userRole === 'admin' ? '/admin/dashboard' : '/shop/home');
      } else {
        // If traditional login fails, try Firebase auth
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          );
          
          // Get Firebase ID token and send to backend
          const idToken = await userCredential.user.getIdToken();
          
          const backendResponse = await fetch('/api/auth/firebase-login', {
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

          const backendData = await backendResponse.json();
          
          if (backendData.success) {
            toast({
              title: "Logged in successfully!",
            });
            navigate(backendData.user?.role === 'admin' ? '/admin/dashboard' : '/shop/home');
          } else {
            throw new Error(backendData.message || 'Backend authentication failed');
          }
          
        } catch (firebaseError) {
          console.error('Firebase login error:', firebaseError);
          toast({
            title: response?.payload?.message || "Login failed",
            description: "Please check your credentials and try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
        onSuccess={(userData) => {
          toast({ title: "Logged in successfully!" });
          navigate(userData.user.role === 'admin' ? '/admin/dashboard' : '/shop/home');
        }}
        onError={(error) => {
          toast({
            title: "Authentication failed",
            description: error,
            variant: "destructive"
          });
        }}
      />
    </div>
  );
}

export default AuthLogin;