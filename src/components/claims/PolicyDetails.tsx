import { Input } from "@heroui/input";
import { useTranslation } from "react-i18next";

export const PolicyDetails = ({ policy }) => {
    const { t } = useTranslation();
    if (!policy) return null;

    return (
        <div className="mb-6">
            <h3 className="text-lg font-bold mb-4 text-gray-700">{t('policyDetails.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input label={t('policyDetails.policyNo')} value={policy.PolicyNo} isReadOnly />
                <Input label={t('policyDetails.effectiveDate')} value={new Date(policy.EffDate).toLocaleDateString()} isReadOnly />
                <Input label={t('policyDetails.expiryDate')} value={new Date(policy.ExpDate).toLocaleDateString()} isReadOnly />
                <Input label={t('policyDetails.policyHolderName')} value={policy.PolicyHolderName} isReadOnly />
            </div>
        </div>
    );
};
