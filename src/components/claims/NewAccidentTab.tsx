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
import { useDisclosure } from "@heroui/use-disclosure";
import ProcessGuideModal from "./ProcessGuideModal";
import { useTranslation } from "react-i18next";

interface PurchasedPolicy {
    policyNo: string;
    productName: string;
    // Add other policy properties here if needed
}

export default function NewAccidentTab() {
    const { t } = useTranslation();
    const [selectedPolicy, setSelectedPolicy] = useState("");
    const [dateOfLoss, setDateOfLoss] = useState("");
    const [purchasedPolicies, setPurchasedPolicies] = useState<PurchasedPolicy[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, retrievedPolicy, currentClaimData } = useSelector((state: RootState) => state.claims);
    const { addNotification } = useNotification();
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        // Cargar las pólizas desde localStorage al montar el componente
        const policies = JSON.parse(localStorage.getItem('purchasedPolicies') || '[]');
        setPurchasedPolicies(policies);
    }, []);

    const selectedPolicyData = purchasedPolicies.find(p => p.policyNo === selectedPolicy);

    const handleRetrievePolicy = () => {
        if (selectedPolicy && dateOfLoss) {
            dispatch(retrievePolicyDetails({ policyNo: selectedPolicy, accidentTime: dateOfLoss }));
        } else {
            addNotification(t('newAccident.notification.selectPolicyAndDate'), "warning");
        }
    };

    const handleReportAccident = () => {
        if (selectedPolicy && dateOfLoss) {
            dispatch(reportAccident({ policyNo: selectedPolicy, dateOfLoss }))
                .unwrap()
                .then((response) => {
                    addNotification(t('newAccident.notification.reportSuccess', { claimNo: response.ClaimCase?.ClaimNo }), "success");
                })
                .catch(() => {
                    addNotification(t('newAccident.notification.reportFailed'), "error");
                });
        }
    };

    return (
        <Card>
            <CardBody className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{t('newAccident.title')}</h2>
                    <Button color="primary" onPress={onOpen} disabled={!currentClaimData}>
                        {t('newAccident.proceed')}
                    </Button>
                </div>

                {currentClaimData && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2 mb-4">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <h3 className="text-lg font-semibold text-green-800">{t('newAccident.successTitle')}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <strong>{t('newAccident.claimNumber')}</strong> {currentClaimData.ClaimCase?.ClaimNo}
                            </div>
                            <div>
                                <strong>{t('newAccident.taskId')}</strong> {currentClaimData.TaskId}
                            </div>
                            <div>
                                <strong>{t('newAccident.productName')}</strong> {currentClaimData.ProductName}
                            </div>
                            <div>
                                <strong>{t('newAccident.policyHolder')}</strong> {currentClaimData.ClaimCase?.PolicyHolderName}
                            </div>
                            <div>
                                <strong>{t('newAccident.policyNumber')}</strong> {currentClaimData.ClaimCase?.PolicyNo}
                            </div>
                            <div>
                                <strong>{t('newAccident.accidentTime')}</strong> {currentClaimData.ClaimCase?.AccidentTime}
                            </div>
                            <div>
                                <strong>{t('newAccident.noticeTime')}</strong> {currentClaimData.ClaimCase?.NoticeTime}
                            </div>
                            <div>
                                <strong>{t('newAccident.status')}</strong> {currentClaimData.ClaimCase?.CaseStatus === "01" ? t('newAccident.statusOpen') : currentClaimData.ClaimCase?.CaseStatus}
                            </div>
                        </div>
                    </div>
                )}

                <ProcessGuideModal
                    isOpen={isOpen}
                    onClose={onClose}
                    policyNumber={selectedPolicy}
                    productName={selectedPolicyData?.productName || ''}
                    claimNo={currentClaimData?.ClaimCase?.ClaimNo}
                    taskId={currentClaimData?.TaskId}
                />

                <div className="space-y-4">
                    <Select
                        label={t('newAccident.selectPolicy')}
                        selectedKeys={selectedPolicy ? [selectedPolicy] : []}
                        onSelectionChange={(keys) => {
                            const policyNo = Array.from(keys)[0] as string;
                            const currentDate = new Date().toISOString().split('T')[0];
                            setSelectedPolicy(policyNo);
                            setDateOfLoss(currentDate);
                            
                            if (policyNo && currentDate) {
                                dispatch(retrievePolicyDetails({ policyNo, accidentTime: currentDate }));
                            }
                        }}
                        required
                    >
                        {purchasedPolicies.map((p: any) => (
                            <SelectItem key={p.policyNo}>
                                {p.policyNo}
                            </SelectItem>
                        ))}
                    </Select>
                    <Input
                        label={t('newAccident.dateOfLoss')}
                        type="date"
                        value={dateOfLoss}
                        onValueChange={(newDate) => {
                            setDateOfLoss(newDate);
                            
                            // Búsqueda automática cuando se cambia la fecha si ya hay una póliza seleccionada
                            if (selectedPolicy && newDate) {
                                dispatch(retrievePolicyDetails({ policyNo: selectedPolicy, accidentTime: newDate }));
                            }
                        }}
                        required
                    />
                    <Button onPress={handleRetrievePolicy} color="primary" isLoading={loading && !retrievedPolicy}>
                        {t('newAccident.searchPolicy')}
                    </Button>
                </div>
                {error && <p className="text-danger mt-4">{error}</p>}
                {retrievedPolicy && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                        <PolicyDetails policy={retrievedPolicy} />
                        <CoverageDetails coverages={retrievedPolicy.ClaimPolicyInsuredList} />

                        <div className="text-right mt-6">
                            <Button onPress={handleReportAccident} color="success" isLoading={loading}>
                                {t('newAccident.confirmAndReport')}
                            </Button>
                        </div>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
