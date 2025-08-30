import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import AppLogo from "../assets/app-logo.png";

interface LoginProps {
  onLogin: (credentials: { username: string; password: string }) => Promise<string | null>;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const userRole = await onLogin({ username, password });

    if (userRole) {
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });

      // Redirect to appropriate dashboard
      switch (userRole) {
        case 'admin':
          setLocation("/admin");
          break;
        case 'student':
          setLocation("/student");
          break;
        case 'barangay':
          setLocation("/barangay");
          break;
        default:
          setLocation("/");
          break;
      }
    } else {
      setError("Invalid username or password");
      toast({
        title: "Error",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src={AppLogo} alt="SmileConnect Logo" className="w-8 h-8 mr-3" />
            <span className="text-2xl font-bold text-gray-800">SmileConnect</span>
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg">
          <CardHeader className="flex justify-center items-center">
            <CardTitle className="text-center">Sign In</CardTitle>
            <p className="text-sm font-thin">Enter your credentials to continue</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <div className="text-red-500 text-center">{error}</div>}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="underline text-blue-600 text-sm flex justify-center mt-5">
              <p>Register</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}