import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/types";
import { AppLogo } from "../assets/app-logo.png";

interface NavigationProps {
  currentUser: {
    id: number;
    firstName: string;
    lastName: string;
    role: UserRole;
  };
  onLogout?: () => void;
}

export function Navigation({ currentUser, onLogout }: NavigationProps) {

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src={AppLogo} alt="SmileConnect Logo" className="w-8 h-8 mr-3" />
              <span className="text-xl font-bold text-gray-800">SmileConnect</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
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
              {onLogout && (
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
