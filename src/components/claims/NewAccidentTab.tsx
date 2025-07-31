import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { AppDispatch, RootState } from "@/store";
import { retrievePolicyDetails, reportAccident } from "@/store/slices/claimsSlice";
import { useNotification } from "@/providers/NotificationProvider";

export default function NewAccidentTab() {
    const [selectedPolicy, setSelectedPolicy] = useState("");
    const [dateOfLoss, setDateOfLoss] = useState("");
    const [purchasedPolicies, setPurchasedPolicies] = useState([]);
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, retrievedPolicy } = useSelector((state: RootState) => state.claims);
    const { addNotification } = useNotification();

    useEffect(() => {
        // Cargar las pólizas desde localStorage al montar el componente
        const policies = JSON.parse(localStorage.getItem('purchasedPolicies') || '[]');
        setPurchasedPolicies(policies);
    }, []);

    const handleRetrievePolicy = () => {
        if (selectedPolicy && dateOfLoss) {
            dispatch(retrievePolicyDetails({ policyNo: selectedPolicy, accidentTime: dateOfLoss }));
        } else {
            addNotification("Please select a policy and a date of loss.", "warning");
        }
    };

    const handleReportAccident = () => {
        if (selectedPolicy && dateOfLoss) {
            dispatch(reportAccident({ policyNo: selectedPolicy, dateOfLoss }))
                .unwrap()
                .then((response) => {
                    addNotification(`Accident reported successfully! Claim number: ${response.ClaimCase.ClaimNo}`, "success");
                })
                .catch(() => {
                    addNotification("Failed to report accident.", "error");
                });
        }
    };

    return (
        <Card>
            <CardBody className="p-6">
                <h2 className="text-xl font-bold mb-4">Report a New Accident</h2>
                <div className="space-y-4">
                    <Select
                        label="Select a Policy"
                        selectedKeys={selectedPolicy ? [selectedPolicy] : []}
                        onSelectionChange={(keys) => setSelectedPolicy(Array.from(keys)[0] as string)}
                        required
                    >
                        {purchasedPolicies.map((p: any) => (
                            <SelectItem key={p.policyNo} value={p.policyNo}>
                                {p.policyNo}
                            </SelectItem>
                        ))}
                    </Select>
                    <Input
                        label="Date of Loss"
                        type="date"
                        value={dateOfLoss}
                        onValueChange={setDateOfLoss}
                        required
                    />
                    <Button onPress={handleRetrievePolicy} color="primary" isLoading={loading && !retrievedPolicy}>
                        Search Policy
                    </Button>
                </div>
                {error && <p className="text-danger mt-4">{error}</p>}
                {retrievedPolicy && (
                    <div className="mt-6 p-4 bg-gray-100 rounded">
                        <h3 className="font-bold">Coverages Found:</h3>
                        <pre className="text-xs overflow-auto">{JSON.stringify(retrievedPolicy.ClaimPolicyInsuredList, null, 2)}</pre>
                        <Button onPress={handleReportAccident} color="success" className="mt-4" isLoading={loading}>
                            Confirm and Report Accident
                        </Button>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
