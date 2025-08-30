import SamImg from "../assets/sam.jpg";
import JunImg from "../assets/jun.png";
import CristineImg from "../assets/christine.png";
import SimoneImg from "../assets/simon.jpg";

import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const teamMembers = [
  {
    name: "Simonee Ezekiel Mariquit",
    role: "Project Manager",
    description: "Leading project coordination and strategic planning",
    img: SimoneImg
  },
  {
    name: "Christine May Ponciano",
    role: "Frontend Developer",
    description: "Creating beautiful and intuitive user interfaces",
    img: CristineImg
  },
  {
    name: "Junjun Zaragosa",
    role: "Backend Developer",
    description: "Building robust server architecture and APIs",
    img: JunImg
  },
  {
    name: "Samuelson De Vera",
    role: "UI/UX Designer",
    description: "Designing user-centered experiences and workflows",
    img: SamImg // Correct filename from your assets
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-transparent py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/src/img/image 2.png" alt="SmileConnect Logo" className="w-8 h-8 mr-3" />
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
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
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

        <div className=" py-16 px-6 md:px-20">
          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              How SmileConnect Benefits Everyone
            </h2>
            <p className="text-lg text-gray-600 mt-2">
              Connecting communities for better dental health
            </p>
          </div>

          {/* Content Section */}
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Student Dentists */}
            <div className="bg-white shadow-md rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Student Dentists
                </h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  Gain hands-on clinical experience with real patients
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  Build your portfolio with diverse dental cases
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  Connect with patients who need affordable care
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  Develop professional skills in a supervised environment
                </li>
              </ul>
            </div>

            {/* Community */}
            <div className="bg-white shadow-md rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Community
                </h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Access affordable dental care from qualified students
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Receive treatment under professional supervision
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Get matched with students based on your needs
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Contribute to the education of future dentists
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="bg-sky-100 rounded-2xl shadow-lg max-w-6xl w-full p-10 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">About Us</h2>
            <p className="text-gray-700 max-w-2xl mx-auto mb-10">
              We are DOST Scholars driven by a shared passion for leveraging
              technology to make healthcare more accessible.
            </p>

            {/* Team Members */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-28 h-28 rounded-full object-cover mb-4 shadow-md"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {member.name}
                  </h3>
                  <p className="text-sky-700 font-medium">{member.role}</p>
                  <p className="text-gray-600 text-sm mt-2">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center items-center flex-col mt-12 text-gray-600 text-sm">
          <p>Supported by START-DOST and DOST-SEI</p>
          <p>Created by Reinassance 2025</p>
        </div>
      </div>
    </div>
  );
}