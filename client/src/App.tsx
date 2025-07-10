import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation";
import AdminDashboard from "@/pages/admin-dashboard";
import StudentDashboard from "@/pages/student-dashboard";
import BarangayDashboard from "@/pages/barangay-dashboard";
import NotFound from "@/pages/not-found";
import { UserRole } from "@/lib/types";

function Router() {
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    firstName: "Maria",
    lastName: "Santos",
    role: "admin" as UserRole,
  });

  const handleRoleChange = (role: UserRole) => {
    // In a real app, this would handle actual user switching or role changes
    // For demo purposes, we'll just update the role and change the user data
    switch (role) {
      case 'admin':
        setCurrentUser({
          id: 1,
          firstName: "Maria",
          lastName: "Santos",
          role: "admin",
        });
        break;
      case 'student':
        setCurrentUser({
          id: 2,
          firstName: "Juan",
          lastName: "Dela Cruz",
          role: "student",
        });
        break;
      case 'barangay':
        setCurrentUser({
          id: 3,
          firstName: "Maria",
          lastName: "Santos",
          role: "barangay",
        });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentUser={currentUser} onRoleChange={handleRoleChange} />
      <Switch>
        <Route path="/" component={() => {
          // Redirect to appropriate dashboard based on role
          switch (currentUser.role) {
            case 'admin':
              return <AdminDashboard />;
            case 'student':
              return <StudentDashboard />;
            case 'barangay':
              return <BarangayDashboard />;
            default:
              return <AdminDashboard />;
          }
        }} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/student" component={StudentDashboard} />
        <Route path="/barangay" component={BarangayDashboard} />
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
