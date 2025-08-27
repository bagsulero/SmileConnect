import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-transparent py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-xl font-bold text-gray-800">SmileConnect</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-800 transition-colors">Home</Link>
            <Link href="/student" className="text-gray-600 hover:text-gray-800 transition-colors">Dentists</Link>
            <Link href="/barangay" className="text-gray-600 hover:text-gray-800 transition-colors">Patients</Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-800 transition-colors">Admin Login</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Connecting
                <br />
                <span className="text-gray-800">Student Dentists</span>
                <br />
                <span className="text-gray-800">with Patients,</span>
                <br />
                <span className="text-gray-800">Hassle-Free.</span>
              </h1>
              
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Find smiles. Build skills.
                </h2>
                <p className="text-lg text-gray-600 max-w-md">
                  Build clinical experience while helping others get affordable dental care.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-slate-700 hover:bg-slate-800 text-white px-8 py-3 rounded-full text-lg font-medium"
                asChild
              >
                <Link href="/student">Join Us</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full text-lg font-medium"
                asChild
              >
                <Link href="/login">Learn More</Link>
              </Button>
            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative w-80 h-[640px] bg-black rounded-[3rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-gradient-to-b from-blue-100 to-blue-50 rounded-[2.5rem] overflow-hidden">
                  {/* Phone Content */}
                  <div className="p-6 space-y-6">
                    {/* App Header */}
                    <div className="flex items-center justify-center py-4">
                      <svg className="w-6 h-6 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span className="text-lg font-bold text-gray-800">SmileConnect</span>
                    </div>

                    {/* Match Found */}
                    <div className="text-center space-y-2">
                      <p className="text-sm text-gray-500 uppercase tracking-wide">PATIENT</p>
                      <h3 className="text-xl font-bold text-blue-600">MATCH FOUND</h3>
                    </div>

                    {/* Patient Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                      {/* Patient Info */}
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Santos, John</h4>
                          <p className="text-sm text-gray-500">Age: 21</p>
                        </div>
                      </div>

                      {/* Procedures */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Procedures</p>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Cleaning</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Filling</span>
                          </div>
                        </div>
                      </div>

                      {/* Confirm Button */}
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 mt-6">
                        Confirm
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone Notch */}
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-black rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}