import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setIsOpen(false);
    };

    const getLanguageLabel = () => {
        switch(i18n.language) {
            case 'es':
                return '🇪🇸 ES';
            case 'pt':
                return '🇧🇷 PT';
            default:
                return '🇺🇸 EN';
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium"
                aria-label="Change language"
            >
                {getLanguageLabel()}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => changeLanguage('en')}
                        className={`block px-4 py-2 text-sm w-full text-left ${
                            i18n.language === 'en' 
                                ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold' 
                                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        🇺🇸 English
                    </button>
                    <button
                        onClick={() => changeLanguage('es')}
                        className={`block px-4 py-2 text-sm w-full text-left ${
                            i18n.language === 'es' 
                                ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold' 
                                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        🇪🇸 Español
                    </button>
                    <button
                        onClick={() => changeLanguage('pt')}
                        className={`block px-4 py-2 text-sm w-full text-left ${
                            i18n.language === 'pt' 
                                ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold' 
                                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        🇧🇷 Português
                    </button>
                </div>
            )}
        </div>
    );
};
