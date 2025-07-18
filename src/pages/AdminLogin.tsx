import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import MainLayout from "@/components/MainLayout";
import { Shield } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const AdminLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().role === 'admin') {
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userId', user.uid);
        localStorage.setItem('userName', userDoc.data().firstName || 'Admin');
        window.dispatchEvent(new Event("storage"));
        
        toast({
          title: "Admin login successful!",
          description: "Redirecting to admin dashboard...",
        });
        
        navigate("/admin/dashboard");
      } else {
        await auth.signOut();
        throw new Error("Not an admin account");
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
      let errorMessage = "Authentication failed. Please check your credentials.";
      if (error.message === "Not an admin account") {
        errorMessage = "You do not have administrative privileges."
      }
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1">
              <div className="flex justify-center">
                <div className="bg-unisphere-darkBlue p-3 rounded-full">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-unisphere-darkBlue mt-2">
                Admin Login
              </CardTitle>
              <CardDescription className="text-center">
                Enter your admin credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@unisphere.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/admin-recover"
                      className="text-sm font-medium text-unisphere-blue hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-unisphere-darkBlue hover:bg-unisphere-blue"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Authenticating..." : "Login to Admin"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                <Link to="/login" className="text-unisphere-blue hover:underline">
                  ← Back to student login
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminLogin;
