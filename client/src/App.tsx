import { useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation";
import LandingPage from "@/pages/landing-page";
import Login from "@/pages/login";
import AdminDashboard from "@/pages/admin-dashboard";
import StudentDashboard from "@/pages/student-dashboard";
import BarangayDashboard from "@/pages/barangay-dashboard";
import NotFound from "@/pages/not-found";
import { UserRole } from "@/lib/types";

function Router() {
  const [, setLocation] = useLocation();
  const [authenticatedUser, setAuthenticatedUser] = useState<{
    id: number;
    firstName: string;
    lastName: string;
    role: UserRole;
  } | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    id: number;
    firstName: string;
    lastName: string;
    role: UserRole;
  } | null>(null);

  // Updated handleLogin to fetch from backend
  const handleLogin = async (credentials: { username: string; password: string }) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) return null;
      const user = await res.json();
      setAuthenticatedUser(user);
      setCurrentUser(user);
      return user.role;
    } catch (err) {
      return null;
    }
  };

  const handleLogout = () => {
    setAuthenticatedUser(null);
    setCurrentUser(null);
    setLocation("/");
  };


  return (
    <div className="min-h-screen">
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={() => (
          <Login onLogin={handleLogin} />
        )} />
        <Route path="/admin" component={() => {
          if (!authenticatedUser || authenticatedUser.role !== 'admin') {
            return <Login onLogin={handleLogin} />;
          }
          return (
            <div className="min-h-screen bg-gray-50">
              <Navigation 
                currentUser={currentUser} 
                onLogout={handleLogout}
              />
              <AdminDashboard />
            </div>
          );
        }} />
        <Route path="/student" component={() => {
          if (!authenticatedUser || authenticatedUser.role !== 'student') {
            return <Login onLogin={handleLogin} />;
          }
          return (
            <div className="min-h-screen bg-gray-50">
              <Navigation 
                currentUser={currentUser} 
                onLogout={handleLogout}
              />
              <StudentDashboard />
            </div>
          );
        }} />
        <Route path="/barangay" component={() => {
          if (!authenticatedUser || authenticatedUser.role !== 'barangay') {
            return <Login onLogin={handleLogin} />;
          }
          return (
            <div className="min-h-screen bg-gray-50">
              <Navigation 
                currentUser={currentUser} 
                onLogout={handleLogout}
              />
              <BarangayDashboard />
            </div>
          );
        }} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
