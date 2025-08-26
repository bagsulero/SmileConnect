import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/types";

interface NavigationProps {
  currentUser: {
    id: number;
    firstName: string;
    lastName: string;
    role: UserRole;
  };
  onRoleChange: (role: UserRole) => void;
  onLogout?: () => void;
}

export function Navigation({ currentUser, onRoleChange, onLogout }: NavigationProps) {
  const [location] = useLocation();
  
  const getDashboardPath = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'student':
        return '/student';
      case 'barangay':
        return '/barangay';
      default:
        return '/';
    }
  };

  const getRoleName = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Admin Dashboard';
      case 'student':
        return 'Student Dashboard';
      case 'barangay':
        return 'Barangay Health Worker';
      default:
        return 'Dashboard';
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <svg className="w-8 h-8 text-medical-blue mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="text-xl font-bold text-gray-800">DentalConnect</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={currentUser.role} onValueChange={(value) => onRoleChange(value as UserRole)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin Dashboard</SelectItem>
                <SelectItem value="student">Student Dashboard</SelectItem>
                <SelectItem value="barangay">Barangay Health Worker</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User Avatar" />
                <AvatarFallback className="bg-medical-blue text-white">
                  {currentUser.firstName[0]}{currentUser.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-700">
                {currentUser.firstName} {currentUser.lastName}
              </span>
              {onLogout && currentUser.role === 'admin' && (
                <Button variant="outline" size="sm" onClick={onLogout}>
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
