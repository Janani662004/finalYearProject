
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "@/components/ui/sonner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [institution, setInstitution] = useState("");
  const navigate = useNavigate();
  const { toast: shadowToast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password || !institution) {
      shadowToast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }
    
    // Check for specific admin credentials
    if (email === "test@example.com" && password === "password1234" && institution === "MCE") {
      toast.success("Login successful! Welcome to the Employee Dashboard");
      navigate("/dashboard");
    } else {
      shadowToast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Invalid credentials. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundColor: "#7DD1BC",
          backgroundImage: `url('/lovable-uploads/d710786d-6688-4e9a-9edc-38954edd8423.png')`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain"
        }}
      />

      <div className="w-full max-w-md px-4 z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">welcome, Admin!</h1>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-100/90"
          />
          
          <Input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-100/90"
          />
          
          <Input
            type="text"
            placeholder="institution"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            className="w-full bg-gray-100/90"
          />
          
          <div className="flex justify-center mt-6">
            <Button
              type="submit"
              className="w-40 rounded-full bg-gray-200 hover:bg-gray-300 text-black"
            >
              login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
