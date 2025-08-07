import { useTranslation } from 'react-i18next';

export function ProductsSection() {
    const { t } = useTranslation();

    return (
        <section className="bg-white py-16">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
                    {t('productsTitle')}
                </h2>
                {/* ...existing code for product cards... */}
            </div>
        </section>
    );
}