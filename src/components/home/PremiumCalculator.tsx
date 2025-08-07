import { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { useTranslation } from 'react-i18next';

interface CalculatorState {
    deviceValue: number;
    deviceType: string;
    coverageLevel: string;
    deductible: number;
}

const deviceTypes = [
    { key: "smartphone", label: "Smartphone", multiplier: 1.0 },
    { key: "tablet", label: "Tablet", multiplier: 0.8 },
    { key: "laptop", label: "Laptop", multiplier: 1.2 },
    { key: "camera", label: "Camera", multiplier: 1.1 },
    { key: "gaming", label: "Gaming System", multiplier: 0.9 },
    { key: "wearable", label: "Wearable", multiplier: 0.7 }
];

const coverageLevels = [
    { key: "basic", label: "Basic Protection", multiplier: 1.0, description: "Covers theft and accidental damage" },
    { key: "standard", label: "Standard Protection", multiplier: 1.3, description: "Includes liquid damage and mechanical breakdown" },
    { key: "premium", label: "Premium Protection", multiplier: 1.6, description: "Comprehensive coverage including unlimited claims" }
];

export const PremiumCalculator = () => {
    const { t } = useTranslation();

    const [calculator, setCalculator] = useState<CalculatorState>({
        deviceValue: 800,
        deviceType: "smartphone",
        coverageLevel: "standard",
        deductible: 100
    });

    const [estimatedPremium, setEstimatedPremium] = useState(0);

    useEffect(() => {
        calculatePremium();
    }, [calculator]);

    const calculatePremium = () => {
        const deviceTypeMultiplier = deviceTypes.find(dt => dt.key === calculator.deviceType)?.multiplier ?? 1;
        const coverageMultiplier = coverageLevels.find(cl => cl.key === calculator.coverageLevel)?.multiplier ?? 1;

        // Base calculation: 8-12% of device value annually
        const baseRate = 0.10;
        const deductibleDiscount = calculator.deductible / calculator.deviceValue * 0.3; // Higher deductible = lower premium

        const premium = calculator.deviceValue * baseRate * deviceTypeMultiplier * coverageMultiplier * (1 - deductibleDiscount);
        setEstimatedPremium(Math.round(premium));
    };

    const updateCalculator = (field: keyof CalculatorState, value: any) => {
        setCalculator(prev => ({ ...prev, [field]: value }));
    };

    const selectedCoverage = coverageLevels.find(cl => cl.key === calculator.coverageLevel);

    return (
        <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {t('premiumCalculatorTitle')}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        {t('premiumCalculatorSubtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Calculator Form */}
                    <Card className="p-6">
                        <CardBody className="space-y-6">
                            <div>
                                <label htmlFor="device-value" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('deviceValueLabel')}
                                </label>
                                <Input
                                    id="device-value"
                                    type="number"
                                    value={calculator.deviceValue.toString()}
                                    onChange={(e) => updateCalculator('deviceValue', Number(e.target.value))}
                                    min={100}
                                    max={5000}
                                    placeholder={t('enterDeviceValue')}
                                />
                            </div>

                            <div>
                                <label htmlFor="device-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('deviceTypeLabel')}
                                </label>
                                <Select
                                    id="device-type"
                                    selectedKeys={[calculator.deviceType]}
                                    onSelectionChange={(keys) => updateCalculator('deviceType', Array.from(keys)[0])}
                                >
                                    {deviceTypes.map(type => (
                                        <SelectItem key={type.key}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>

                            <div>
                                <label htmlFor="coverage-level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('coverageLevelLabel')}
                                </label>
                                <Select
                                    id="coverage-level"
                                    selectedKeys={[calculator.coverageLevel]}
                                    onSelectionChange={(keys) => updateCalculator('coverageLevel', Array.from(keys)[0])}
                                >
                                    {coverageLevels.map(level => (
                                        <SelectItem key={level.key}>
                                            {level.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                                {selectedCoverage && (
                                    <p className="text-sm text-gray-500 mt-1">{selectedCoverage.description}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="deductible-range" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('deductibleLabel', { amount: calculator.deductible })}
                                </label>
                                <input
                                    id="deductible-range"
                                    type="range"
                                    value={calculator.deductible}
                                    onChange={(e) => updateCalculator('deductible', Number(e.target.value))}
                                    min={50}
                                    max={500}
                                    step={25}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>$50</span>
                                    <span>$500</span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Results */}
                    <Card className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                        <CardBody className="text-center space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">{t('estimatedPremium')}</h3>
                                <div className="text-5xl font-bold text-yellow-300">
                                    ${estimatedPremium}
                                </div>
                                <p className="text-blue-100 mt-2">{t('perYear')}</p>
                            </div>

                            <div className="space-y-3 text-left bg-white/10 rounded-lg p-4">
                                <div className="flex justify-between">
                                    <span>{t('deviceValue')}:</span>
                                    <span>${calculator.deviceValue}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{t('coverage')}:</span>
                                    <span>{selectedCoverage?.label}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{t('deductible')}:</span>
                                    <span>${calculator.deductible}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{t('monthly')}:</span>
                                    <span>${Math.round(estimatedPremium / 12)}</span>
                                </div>
                            </div>

                            <Button
                                color="warning"
                                size="lg"
                                className="w-full font-semibold"
                            >
                                {t('getThisQuote')}
                            </Button>

                            <p className="text-xs text-blue-100">
                                * {t('estimateDisclaimer')}
                            </p>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </section>
    );
};
