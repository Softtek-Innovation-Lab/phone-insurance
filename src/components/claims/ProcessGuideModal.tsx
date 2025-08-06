import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { useState, useCallback, useMemo } from "react";
import {
    processFNOL,
    processRegistration,
    processInvestigation,
    processAppraisal,
    processAppraisalApproval,
    processDocument,
    processCalculation,
    processCalculationApproval,
    processSettlement,
    processSettlementApproval,
    processCloseStep
} from "@/services/claimService";
import FNOLForm, { FNOLData } from "./FNOLForm";

interface ProcessGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
    policyNumber: string;
    productName: string;
    claimNo?: string;
    taskId?: string;
}

export default function ProcessGuideModal({ isOpen, onClose, policyNumber, productName, claimNo, taskId }: ProcessGuideModalProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [fnolData, setFnolData] = useState<FNOLData | null>(null);

    const createStepHandler = (processFunction: (policyNumber: string, data?: any, claimNo?: string, taskId?: string) => Promise<any>) =>
        useCallback(async (data?: any) => {
            setIsLoading(true);
            try {
                await processFunction(policyNumber, data, claimNo, taskId);
            } catch (error) {
                console.error(`Error processing step:`, error);
            } finally {
                setIsLoading(false);
            }
        }, [policyNumber, claimNo, taskId]);

    const handleFNOL = createStepHandler(processFNOL);
    const handleRegistration = createStepHandler(processRegistration);
    const handleInvestigation = createStepHandler(processInvestigation);
    const handleAppraisal = createStepHandler(processAppraisal);
    const handleAppraisalApproval = createStepHandler(processAppraisalApproval);
    const handleDocument = createStepHandler(processDocument);
    const handleCalculation = createStepHandler(processCalculation);
    const handleCalculationApproval = createStepHandler(processCalculationApproval);
    const handleSettlement = createStepHandler(processSettlement);
    const handleSettlementApproval = createStepHandler(processSettlementApproval);
    const handleCloseStep = createStepHandler(processCloseStep);


    const steps = useMemo(() => [
        { title: "FNOL (First Notice of Loss)", description: "El asegurado notifica por primera vez la ocurrencia del siniestro.", action: handleFNOL },
        { title: "Cancel (1)", description: "Posibilidad de cancelar el reclamo antes de registrarlo." },
        { title: "Registration", description: "El reclamo se registra formalmente en el sistema.", action: handleRegistration },
        { title: "Cancel (2)", description: "Posibilidad de cancelar después del registro y antes de la investigación." },
        { title: "Investigation", description: "Se recaban detalles y evidencias del siniestro.", action: handleInvestigation },
        { title: "Appraisal", description: "Se realiza la tasación o valuación de los daños.", action: handleAppraisal },
        { title: "Appraisal Approval", description: "La tasación es revisada y aprobada.", action: handleAppraisalApproval },
        { title: "Document", description: "Se generan o solicitan documentos necesarios (peritajes, fotos, formularios).", action: handleDocument },
        { title: "Calculation", description: "Cálculo del monto a indemnizar.", action: handleCalculation },
        { title: "Decline (1)", description: "El reclamo puede ser rechazado en este punto si no corresponde indemnización." },
        { title: "Calculation Approval", description: "El cálculo de indemnización es revisado y aprobado.", action: handleCalculationApproval },
        { title: "Settlement", description: "Se inicia el proceso de pago o compensación.", action: handleSettlement },
        { title: "Decline (2)", description: "Se puede rechazar el pago en esta etapa final si corresponde." },
        { title: "Settlement Approval", description: "Aprobación final del pago.", action: handleSettlementApproval },
        { title: "Close", description: "El reclamo se cierra oficialmente.", action: handleCloseStep }
    ], [handleFNOL, handleRegistration, handleInvestigation, handleAppraisal, handleAppraisalApproval, handleDocument, handleCalculation, handleCalculationApproval, handleSettlement, handleSettlementApproval, handleCloseStep]);

    const handleNext = async () => {
        const currentStepData = steps[currentStep];
        if (currentStepData.action) {
            if (currentStepData.title === "FNOL (First Notice of Loss)") {
                await handleFNOL(fnolData);
            } else {
                await currentStepData.action();
            }
        }

        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onClose(); // Close modal on last step
        }
    };

    const handleClose = () => {
        setCurrentStep(0);
        onClose();
    }

    const currentStepData = steps[currentStep];

    return (
        <Modal isOpen={isOpen} onOpenChange={handleClose} isDismissable={false}>
            <ModalContent>
                <>
                    <ModalHeader className="flex flex-col gap-1">Claim Process Guide</ModalHeader>
                    <ModalBody>
                        {currentStepData.title === "FNOL (First Notice of Loss)" ? (
                            <FNOLForm
                                policyNumber={policyNumber}
                                productName={productName}
                                onDataChange={setFnolData}
                                claimNo={claimNo}
                                taskId={taskId}
                            />
                        ) : (
                            <>
                                <h3 className="font-bold text-lg mb-2">{currentStepData.title}</h3>
                                <p>{currentStepData.description}</p>
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={handleClose}>
                            Close
                        </Button>
                        <div className="flex gap-2">
                            <Button
                                color="default"
                                variant="bordered"
                                onPress={() => setCurrentStep(currentStep - 1)}
                                disabled={currentStep === 0}
                            >
                                Previous
                            </Button>
                            <Button color="primary" onPress={handleNext} disabled={isLoading}>
                                {isLoading ? "Loading..." : (currentStep < steps.length - 1 ? "Next" : "Finish")}
                            </Button>
                        </div>
                    </ModalFooter>
                </>
            </ModalContent>
        </Modal>
    );
}
