import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";

export const PolicyDetails = ({ policy }) => {
    if (!policy) return null;

    return (
        <div className="mb-6">
            <h3 className="text-lg font-bold mb-4 text-gray-700">Policy Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input label="Policy No." value={policy.PolicyNo} isReadOnly />
                <Input label="Effective Date" value={new Date(policy.EffDate).toLocaleDateString()} isReadOnly />
                <Input label="Expiry Date" value={new Date(policy.ExpDate).toLocaleDateString()} isReadOnly />
                <Input label="Policy Holder Name" value={policy.PolicyHolderName} isReadOnly />
            </div>
        </div>
    );
};
