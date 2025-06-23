import { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: "What devices are covered by the insurance?",
        answer: "Our insurance covers smartphones, tablets, laptops, cameras, gaming systems, smartwatches, and other electronic devices. Coverage includes protection against theft, accidental damage, liquid damage, and mechanical breakdown."
    },
    {
        question: "How quickly can I file a claim?",
        answer: "Claims can be filed 24/7 through our online portal or mobile app. Most claims are processed within 24-48 hours, and repairs or replacements are typically completed within 3-5 business days."
    },
    {
        question: "What is the deductible amount?",
        answer: "Deductible amounts vary by device type and coverage level. Typically ranges from $50-$200. The exact deductible for your device will be clearly shown during the quote process."
    },
    {
        question: "Can I insure a used or refurbished device?",
        answer: "Yes, we cover used and refurbished devices as long as they are in good working condition and meet our eligibility requirements. The device must be less than 3 years old and pass our inspection process."
    },
    {
        question: "Is there a waiting period before coverage begins?",
        answer: "Coverage begins immediately upon policy activation for mechanical breakdown. For theft and accidental damage, there is a 48-hour waiting period to prevent fraud."
    },
    {
        question: "How many claims can I make per year?",
        answer: "Most policies allow 2-3 claims per year, depending on your coverage level. Unlimited claims are available with our premium plans."
    }
];

export const FAQSection = () => {
    const [openItems, setOpenItems] = useState<number[]>([]);

    const toggleItem = (index: number) => {
        setOpenItems(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Frequently Asked Questions
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
