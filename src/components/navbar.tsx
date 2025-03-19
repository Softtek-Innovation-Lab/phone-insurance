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

          {/* Top Navigation */}
          <nav aria-label="Top navigation">
            <ul className="hidden lg:flex items-center gap-6 text-xs font-medium text-gray-700 uppercase">
              <li>
                <Link to="/contact-us" className="hover:text-red-600">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="https://brokersireland.ie/?option=com_wrapper&view=wrapper&Itemid=575"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-600"
                >
                  Find a Broker
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Navigation Section: Gray Background */}
        <div className="bg-gray-100">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-10">
            {/* Main Navigation Links */}
            <nav className="flex justify-center gap-8" aria-label="Main navigation">
              <Link
                to="/industry-solutions"
                className="text-base font-medium text-gray-700 hover:text-red-600"
              >
                Industry Solutions
              </Link>
              <Link
                to="/products-services"
                className="text-base font-medium text-gray-700 hover:text-red-600"
              >
                Products & Services
              </Link>
              <Link
                to="/travelers-advantage"
                className="text-base font-medium text-gray-700 hover:text-red-600"
              >
                Why Travelers
              </Link>
              <Link
                to="/brokers"
                className="text-base font-medium text-gray-700 hover:text-red-600"
              >
                Brokers
              </Link>
              <Link
                to="/claims-centre"
                className="text-base font-medium text-gray-700 hover:text-red-600"
              >
                Claims Centre
              </Link>
            </nav>

            {/* Log In Button */}
            <Link
              to="https://www.mytravelers.travelers.co.uk/wps/portal/trv/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 hidden lg:flex items-center gap-2 border border-red-600 px-3 py-1 text-red-600 font-semibold text-sm uppercase rounded hover:bg-red-600 hover:text-white transition"
            >
              <UserCircle className="h-4 w-4" />
              <span>Log In</span>
            </Link>

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