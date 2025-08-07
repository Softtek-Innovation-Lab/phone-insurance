"use client";

import { Link } from "react-router-dom";
import { ShoppingCart, UserCircle } from "lucide-react";
import travelersLogo from "@/assets/generic-logo.png"
import { useGlobalStore } from "@/hooks/useGlobalStore";
import { useAuth } from "@/auth/AuthProvider";
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navbar = () => {
  const { t } = useTranslation();
  const { store } = useGlobalStore();
  const { user, logout } = useAuth();
  const cartItemCount = store?.cart?.length ?? 0;

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
                <span className="pointer-events-none">{t('contactUs')}</span>
              </li>
              <li>
                <span className="pointer-events-none">{t('findBroker')}</span>
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
              <a
                href="#get-insurance"
                className="text-base font-medium text-gray-700 hover:text-red-600"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById("get-insurance");
                  if (element) {
                    const offset = -50;
                    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = elementPosition + offset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                  } else {
                    window.location.href = "/";
                  }
                }}
              >
                {t('getInsuranceNav')}
              </a>
              <Link
                to="/cart"
                className="text-base font-medium text-gray-700 hover:text-red-600"
              >
                {t('cart.nav')}
              </Link>
              {/* Disabled Links */}
              <span className="text-base font-medium text-gray-400 cursor-not-allowed pointer-events-none">
                {t('industrySolutions')}
              </span>
              <span className="text-base font-medium text-gray-400 cursor-not-allowed pointer-events-none">
                {t('productsAndServices')}
              </span>
              <span className="text-base font-medium text-gray-400 cursor-not-allowed pointer-events-none">
                {t('whyTravelers')}
              </span>
              <span className="text-base font-medium text-gray-400 cursor-not-allowed pointer-events-none">
                {t('brokers')}
              </span>
              <Link
                to="/claims-centre"
                className="text-base font-medium text-gray-700 hover:text-red-600"
              >
                {t('claimsCentre')}
              </Link>
            </nav>

            <div className="ml-4 hidden lg:flex items-center gap-4">
              <LanguageSwitcher />
              {/* Cart Icon with Counter */}
              <Link
                to="/cart"
                className="relative flex items-center text-gray-700 hover:text-red-600"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* User/Login Icon */}
              {user ? (
                <div className="flex items-center gap-2">
                  <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-red-600">
                    <UserCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">{user.name}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="text-sm font-medium text-red-600 hover:underline"
                  >
                    {t('logout')}
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center text-gray-700 hover:text-red-600"
                  aria-label="Login"
                >
                  <UserCircle className="h-5 w-5" />
                  <span className="ml-1 text-sm font-medium">{t('login')}</span>
                </Link>
              )}
            </div>
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