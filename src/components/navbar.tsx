"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, UserCircle, Menu, X } from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto">
        {/* Top Section: Secondary Navigation */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-10">
              {/* Top Navigation */}
              <nav aria-label="Secondary navigation" className="hidden md:block">
                <ul className="flex items-center gap-6 text-xs font-medium text-gray-500 uppercase">
                  <li>
                    <span className="hover:text-gray-700 cursor-pointer transition-colors">{t('contactUs')}</span>
                  </li>
                  <li>
                    <span className="hover:text-gray-700 cursor-pointer transition-colors">{t('findBroker')}</span>
                  </li>
                </ul>
              </nav>
              
              {/* Language Switcher - Desktop */}
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link to="/" title="Travelers Home Page" className="flex items-center">
                  <img src={travelersLogo} alt="Travelers" className="h-10 w-auto" />
                  <span className="sr-only">Travelers Home Page</span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:block" aria-label="Main navigation">
                <div className="flex items-center space-x-8">
                  <a
                    href="#get-insurance"
                    className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors py-2 border-b-2 border-transparent hover:border-red-600"
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
                    to="/products-services"
                    className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors py-2 border-b-2 border-transparent hover:border-red-600"
                  >
                    {t('productsAndServices')}
                  </Link>
                  <Link
                    to="/claims-centre"
                    className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors py-2 border-b-2 border-transparent hover:border-red-600"
                  >
                    {t('claimsCentre')}
                  </Link>
                  <span className="text-sm font-medium text-gray-400 cursor-not-allowed">
                    {t('industrySolutions')}
                  </span>
                  <span className="text-sm font-medium text-gray-400 cursor-not-allowed">
                    {t('whyTravelers')}
                  </span>
                  <span className="text-sm font-medium text-gray-400 cursor-not-allowed">
                    {t('brokers')}
                  </span>
                </div>
              </nav>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-4">
                {/* Cart Icon */}
                <Link
                  to="/cart"
                  className="relative p-2 text-gray-600 hover:text-red-600 transition-colors rounded-full hover:bg-gray-100"
                  aria-label="Shopping Cart"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                {/* User/Login */}
                {user ? (
                  <div className="hidden lg:flex items-center space-x-3">
                    <Link 
                      to="/profile" 
                      className="flex items-center space-x-2 p-2 text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-100"
                    >
                      <UserCircle className="h-6 w-6" />
                      <span className="text-sm font-medium">{user.name}</span>
                    </Link>
                    <button
                      onClick={logout}
                      className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors px-3 py-1 rounded-md hover:bg-red-50"
                    >
                      {t('logout')}
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="hidden lg:flex items-center space-x-2 p-2 text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-100"
                    aria-label="Login"
                  >
                    <UserCircle className="h-6 w-6" />
                    <span className="text-sm font-medium">{t('login')}</span>
                  </Link>
                )}

                {/* Mobile Menu Button */}
                <button
                  onClick={toggleMobileMenu}
                  className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label="Toggle mobile menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
              <nav className="space-y-4">
                <a
                  href="#get-insurance"
                  className="block text-base font-medium text-gray-900 hover:text-red-600 transition-colors py-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
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
                  className="block text-base font-medium text-gray-900 hover:text-red-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('cart.nav')}
                </Link>
                <Link
                  to="/claims-centre"
                  className="block text-base font-medium text-gray-900 hover:text-red-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('claimsCentre')}
                </Link>
                <Link
                  to="/products-services"
                  className="block text-base font-medium text-gray-900 hover:text-red-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('productsAndServices')}
                </Link>
                
                {/* User Section for Mobile */}
                <div className="pt-4 border-t border-gray-200">
                  {user ? (
                    <div className="space-y-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 text-base font-medium text-gray-900 hover:text-red-600 transition-colors py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <UserCircle className="h-5 w-5" />
                        <span>{user.name}</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="block text-base font-medium text-red-600 hover:text-red-700 transition-colors py-2"
                      >
                        {t('logout')}
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="flex items-center space-x-2 text-base font-medium text-gray-900 hover:text-red-600 transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserCircle className="h-5 w-5" />
                      <span>{t('login')}</span>
                    </Link>
                  )}
                </div>

                {/* Language Switcher for Mobile */}
                <div className="pt-4 border-t border-gray-200">
                  <LanguageSwitcher />
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
