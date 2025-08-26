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
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    firstName: "Maria",
    lastName: "Santos",
    role: "admin" as UserRole,
  });

  const handleLogin = (credentials: { username: string; password: string }) => {
    let user = null;
    
    if (credentials.username === "admin" && credentials.password === "admin") {
      user = {
        id: 1,
        firstName: "Maria",
        lastName: "Santos",
        role: "admin" as UserRole,
      };
    } else if (credentials.username === "student" && credentials.password === "student") {
      user = {
        id: 2,
        firstName: "Juan",
        lastName: "Dela Cruz",
        role: "student" as UserRole,
      };
    } else if (credentials.username === "health" && credentials.password === "health") {
      user = {
        id: 3,
        firstName: "Maria",
        lastName: "Santos",
        role: "barangay" as UserRole,
      };
    }
    
    if (user) {
      setAuthenticatedUser(user);
      setCurrentUser(user);
      return user.role;
    }
    return null;
  };

  const handleLogout = () => {
    setAuthenticatedUser(null);
    setCurrentUser({
      id: 1,
      firstName: "Maria",
      lastName: "Santos",
      role: "admin",
    });
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
