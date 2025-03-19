"use client";

import { Link } from "react-router-dom";
import { UserCircle } from "lucide-react";
import travelersLogo from "@/assets/travelers-logo.svg";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200">
      <div className="mx-auto">
        {/* Top Section: Logo and Top Navigation */}
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-12">
          {/* Logo */}
          <Link to="/" title="Travelers Home Page">
            <img src={travelersLogo} alt="Travelers" className="h-8" />
            <span className="sr-only">Travelers Home Page</span>
          </Link>

          {/* Top Navigation (Disabled) */}
          <nav aria-label="Top navigation">
            <ul className="hidden lg:flex items-center gap-6 text-xs font-medium text-gray-400 uppercase cursor-not-allowed">
              <li>
                <span className="pointer-events-none">Contact Us</span>
              </li>
              <li>
                <span className="pointer-events-none">Find a Broker</span>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Navigation Section: Gray Background */}
        <div className="bg-gray-100">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-10">
            {/* Main Navigation Links */}
            <nav className="flex justify-center gap-8" aria-label="Main navigation">

              {/* Active Links: Get Insurance and Cart */}
              <Link
                to="/get-insurance"
                className="text-base font-medium text-gray-700 hover:text-red-600"
              >
                Get Insurance
              </Link>
              <Link
                to="/cart"
                className="text-base font-medium text-gray-700 hover:text-red-600"
              >
                Cart
              </Link>
              {/* Disabled Links */}
              <span className="text-base font-medium text-gray-400 cursor-not-allowed pointer-events-none">
                Industry Solutions
              </span>
              <span className="text-base font-medium text-gray-400 cursor-not-allowed pointer-events-none">
                Products & Services
              </span>
              <span className="text-base font-medium text-gray-400 cursor-not-allowed pointer-events-none">
                Why Travelers
              </span>
              <span className="text-base font-medium text-gray-400 cursor-not-allowed pointer-events-none">
                Brokers
              </span>
              <span className="text-base font-medium text-gray-400 cursor-not-allowed pointer-events-none">
                Claims Centre
              </span>


            </nav>

            {/* Log In Button (Disabled) */}
            <span
              className="ml-4 hidden lg:flex items-center gap-2 border border-gray-400 px-3 py-1 text-gray-400 font-semibold text-sm uppercase rounded cursor-not-allowed pointer-events-none"
            >
              <UserCircle className="h-4 w-4" />
              <span>Log In</span>
            </span>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden flex items-center p-2 text-gray-700 hover:text-red-600"
              aria-label="Open mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};