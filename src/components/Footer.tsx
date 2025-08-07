"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const [email, setEmail] = useState('');
    const footerRef = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        // Set up Intersection Observer for animation
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        // Observe the footer
        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        return () => {
            if (footerRef.current) {
                observer.unobserve(footerRef.current);
            }
        };
    }, []);

    const handleSubscribe = (e) => {
        e.preventDefault();
        // Handle newsletter subscription
        console.log('Subscribing email:', email);
        setEmail('');
        // Show success message or toast notification
    };

    return (
        <footer ref={footerRef} className="footer-container bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="footer-column">
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{t('footer.companyDescription')}</h2>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                {t('footer.companyDescription')}
                            </p>
                        </div>
                        <div className="flex space-x-4 mt-6">
                            {/* Social icons remain unchanged */}
                            <a href="#" className="social-icon" aria-label="Facebook">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>
                            <a href="#" className="social-icon" aria-label="Twitter">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                                </svg>
                            </a>
                            <a href="#" className="social-icon" aria-label="Instagram">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                            <a href="#" className="social-icon" aria-label="LinkedIn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                    <rect x="2" y="9" width="4" height="12"></rect>
                                    <circle cx="4" cy="4" r="2"></circle>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-column">
                        <h3 className="footer-title">{t('footer.products')}</h3>
                        <ul className="footer-links">
                            <li><a href="#">{t('footer.phoneInsurance')}</a></li>
                            <li><a href="#">{t('footer.laptopInsurance')}</a></li>
                            <li><a href="#">{t('footer.tabletInsurance')}</a></li>
                            <li><a href="#">{t('footer.cameraInsurance')}</a></li>
                            <li><a href="#">{t('footer.wearablesInsurance')}</a></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="footer-column">
                        <h3 className="footer-title">{t('footer.company')}</h3>
                        <ul className="footer-links">
                            <li><a href="#">{t('footer.aboutUs')}</a></li>
                            <li><a href="#">{t('footer.careers')}</a></li>
                            <li><a href="#">{t('footer.blog')}</a></li>
                            <li><a href="#">{t('footer.press')}</a></li>
                            <li><a href="#">{t('footer.partners')}</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="footer-column">
                        <h3 className="footer-title">{t('footer.stayUpdated')}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                            {t('footer.subscribeNewsletter')}
                        </p>
                        <form onSubmit={handleSubscribe} className="newsletter-form">
                            <div className="flex flex-col space-y-2">
                                <Input
                                    type="email"
                                    placeholder={t('footer.yourEmail')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-white dark:bg-gray-800"
                                />
                                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                                    {t('footer.subscribe')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
                            {t('footer.copyright', { year: new Date().getFullYear() })}
                        </div>
                        <div className="flex space-x-6">
                            <a className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                {t('footer.privacyPolicy')}
                            </a>
                            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                {t('footer.termsOfService')}
                            </a>
                            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                {t('footer.cookiePolicy')}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
