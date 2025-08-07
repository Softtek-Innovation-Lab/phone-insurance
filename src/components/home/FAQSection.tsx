import { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { useTranslation } from 'react-i18next';

interface FAQItem {
    question: string;
    answer: string;
}

export const FAQSection = () => {
    const { t } = useTranslation();
    const [openItems, setOpenItems] = useState<number[]>([]);

    const toggleItem = (index: number) => {
        setOpenItems(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const faqData: FAQItem[] = [
        {
            question: t('faq1q'),
            answer: t('faq1a'),
        },
        {
            question: t('faq2q'),
            answer: t('faq2a'),
        },
        {
            question: t('faq3q'),
            answer: t('faq3a'),
        },
        {
            question: t('faq4q'),
            answer: t('faq4a'),
        },
        {
            question: t('faq5q'),
            answer: t('faq5a'),
        },
        {
            question: t('faq6q'),
            answer: t('faq6a'),
        }
    ];

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {t('faqTitle')}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Get answers to common questions about our device insurance
                    </p>
                </div>

                <div className="space-y-4">
                    {faqData.map((item, index) => (
                        <Card key={index} className="w-full">
                            <CardBody className="p-0">
                                <Button
                                    variant="light"
                                    onPress={() => toggleItem(index)}
                                    className="w-full p-6 text-left justify-between h-auto"
                                >
                                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {item.question}
                                    </span>
                                    <span className="text-2xl text-gray-500 transition-transform duration-200"
                                        style={{ transform: openItems.includes(index) ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                                        +
                                    </span>
                                </Button>

                                {openItems.includes(index) && (
                                    <div className="px-6 pb-6 animate-fade-in">
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {item.answer}
                                        </p>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Still have questions?
                    </p>
                    <Button color="primary" size="lg">
                        Contact Support
                    </Button>
                </div>
            </div>
        </section>
    );
};
