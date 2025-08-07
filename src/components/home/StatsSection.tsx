import { useTranslation } from 'react-i18next';

interface Stat {
    value: string;
    label: string;
    description: string;
    icon: string;
}

export const StatsSection = () => {
    const { t } = useTranslation();
    const stats: Stat[] = [
        {
            value: "50+",
            label: t('stat1'),
            description: "Decades of trusted service and expertise",
            icon: "🏢"
        },
        {
            value: "98%",
            label: t('stat2'),
            description: "Consistently high ratings from our clients",
            icon: "😊"
        },
        {
            value: "24/7",
            label: t('stat3'),
            description: "Round-the-clock assistance when you need it",
            icon: "🕐"
        },
        {
            value: "48hrs",
            label: t('stat4'),
            description: "Fast processing for quick resolutions",
            icon: "⚡"
        },
        {
            value: "1M+",
            label: "Devices Protected",
            description: "Trusted by millions of satisfied customers",
            icon: "📱"
        },
        {
            value: "A+",
            label: "Best Rating",
            description: "Top-rated by industry standards",
            icon: "⭐"
        }
    ];

    return (
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">
                        {t('trusted_by_millions')}
                    </h2>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        {t('why_choose_us')}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="text-center animate-fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="text-4xl mb-2">{stat.icon}</div>
                            <div className="text-3xl font-bold text-yellow-300 mb-1">
                                {stat.value}
                            </div>
                            <div className="text-lg font-semibold mb-2">
                                {stat.label}
                            </div>
                            <div className="text-sm text-blue-100 leading-tight">
                                {stat.description}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <div className="inline-flex items-center gap-2 text-yellow-300">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        <span className="text-lg font-semibold">{t('lightning_fast_claims')}</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
