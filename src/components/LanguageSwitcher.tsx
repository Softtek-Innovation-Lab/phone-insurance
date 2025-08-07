import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-2 py-1 rounded hover:bg-gray-200 border border-gray-300 text-gray-700"
                aria-label="Change language"
            >
                🌐
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                        onClick={() => changeLanguage('en')}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                        English
                    </button>
                    <button
                        onClick={() => changeLanguage('es')}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                        Español
                    </button>
                </div>
            )}
        </div>
    );
};
