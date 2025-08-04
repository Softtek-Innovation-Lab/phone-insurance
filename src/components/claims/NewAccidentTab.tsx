import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { CheckCircle } from "lucide-react";
import { AppDispatch, RootState } from "@/store";
import { retrievePolicyDetails, reportAccident } from "@/store/slices/claimsSlice";
import { useNotification } from "@/providers/NotificationProvider";
import { PolicyDetails } from "./PolicyDetails";
import { CoverageDetails } from "./CoverageDetails";

export default function NewAccidentTab() {
    const [selectedPolicy, setSelectedPolicy] = useState("");
    const [dateOfLoss, setDateOfLoss] = useState("");
    const [purchasedPolicies, setPurchasedPolicies] = useState([]);
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, retrievedPolicy, currentClaimData } = useSelector((state: RootState) => state.claims);
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
                    addNotification(`Accident reported successfully! Claim number: ${response.ClaimCase?.ClaimNo}`, "success");
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

                {currentClaimData && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2 mb-4">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <h3 className="text-lg font-semibold text-green-800">Accident Reported Successfully!</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <strong>Claim Number:</strong> {currentClaimData.ClaimCase?.ClaimNo}
                            </div>
                            <div>
                                <strong>Task ID:</strong> {currentClaimData.TaskId}
                            </div>
                            <div>
                                <strong>Product Name:</strong> {currentClaimData.ProductName}
                            </div>
                            <div>
                                <strong>Policy Holder:</strong> {currentClaimData.ClaimCase?.PolicyHolderName}
                            </div>
                            <div>
                                <strong>Policy Number:</strong> {currentClaimData.ClaimCase?.PolicyNo}
                            </div>
                            <div>
                                <strong>Accident Time:</strong> {currentClaimData.ClaimCase?.AccidentTime}
                            </div>
                            <div>
                                <strong>Notice Time:</strong> {currentClaimData.ClaimCase?.NoticeTime}
                            </div>
                            <div>
                                <strong>Status:</strong> {currentClaimData.ClaimCase?.CaseStatus === "01" ? "Open" : currentClaimData.ClaimCase?.CaseStatus}
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <Select
                        label="Select a Policy"
                        selectedKeys={selectedPolicy ? [selectedPolicy] : []}
                        onSelectionChange={(keys) => setSelectedPolicy(Array.from(keys)[0] as string)}
                        required
                    >
                        {purchasedPolicies.map((p: any) => (
                            <SelectItem key={p.policyNo}>
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
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                        <PolicyDetails policy={retrievedPolicy} />
                        <CoverageDetails coverages={retrievedPolicy.ClaimPolicyInsuredList} />

                        <div className="text-right mt-6">
                            <Button onPress={handleReportAccident} color="success" isLoading={loading}>
                                Confirm and Report Accident
                            </Button>
                        </div>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
