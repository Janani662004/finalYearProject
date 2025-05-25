import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase"; // use your existing path

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [institution, setInstitution] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !institution) {
      toast({
        variant: "destructive",
        title: "Missing Info",
        description: "Please fill in all the fields!",
      });
      return;
    }

    // 🔒 check if admin already exists
    const { data: existing, error: checkError } = await supabase
      .from("admin")
      .select("*")
      .eq("email", email)
      .single();

    if (existing) {
      toast({
        variant: "destructive",
        title: "Already Registered",
        description: "An admin with this email already exists.",
      });
      return;
    }

    // 🛠️ Insert into Supabase admin table
    const { error } = await supabase.from("admin").insert([
      {
        email,
        password,
        institution,
      },
    ]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message,
      });
    } else {
      toast({
        variant: "success",
        title: "Account Created 🎉",
        description: "You can now log in as Admin.",
      });
      navigate("/loginpage");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background design same as login page */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundColor: "#7DD1BC",
          backgroundImage: `url('/lovable-uploads/d710786d-6688-4e9a-9edc-38954edd8423.png')`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      />

      <div className="w-full max-w-md px-4 z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Admin Sign Up</h1>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
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
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
