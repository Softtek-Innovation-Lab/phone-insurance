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
    const [fnolSubStep, setFnolSubStep] = useState(0);
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
        
        // Si estamos en FNOL y aún hay sub-pasos, avanzar al siguiente sub-paso
        if (currentStepData.title === "FNOL (First Notice of Loss)" && fnolSubStep < 2) {
            setFnolSubStep(fnolSubStep + 1);
            return;
        }
        
        // Si terminamos todos los sub-pasos de FNOL o estamos en otro paso, procesar la acción
        if (currentStepData.action) {
            if (currentStepData.title === "FNOL (First Notice of Loss)") {
                await handleFNOL(fnolData);
                setFnolSubStep(0); // Reset sub-step for next time
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

    const handlePrevious = () => {
        const currentStepData = steps[currentStep];
        
        // Si estamos en FNOL y no es el primer sub-paso, retroceder al sub-paso anterior
        if (currentStepData.title === "FNOL (First Notice of Loss)" && fnolSubStep > 0) {
            setFnolSubStep(fnolSubStep - 1);
        } else if (currentStep > 0) {
            // Si no, retroceder al paso anterior
            setCurrentStep(currentStep - 1);
            // Si el paso anterior es FNOL, ir al último sub-paso
            if (steps[currentStep - 1].title === "FNOL (First Notice of Loss)") {
                setFnolSubStep(2);
            }
        }
    };

    const handleClose = () => {
        setCurrentStep(0);
        setFnolSubStep(0);
        onClose();
    }

    const currentStepData = steps[currentStep];
    const isFNOLStep = currentStepData.title === "FNOL (First Notice of Loss)";
    const fnolSubStepTitles = ["Información Básica", "Información de Contacto", "Detalles del Accidente"];

    return (
        <Modal isOpen={isOpen} onOpenChange={handleClose} isDismissable={false} size="3xl">
            <ModalContent>
                <>
                    <ModalHeader className="flex flex-col gap-1">
                        <span>Claim Process Guide</span>
                        {isFNOLStep && (
                            <span className="text-sm font-normal text-gray-500">
                                FNOL - Paso {fnolSubStep + 1} de 3: {fnolSubStepTitles[fnolSubStep]}
                            </span>
                        )}
                    </ModalHeader>
                    <ModalBody className="max-h-[60vh] overflow-y-auto">
                        {isFNOLStep ? (
                            <FNOLForm
                                policyNumber={policyNumber}
                                productName={productName}
                                onDataChange={setFnolData}
                                claimNo={claimNo}
                                taskId={taskId}
                                currentSubStep={fnolSubStep}
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
                                onPress={handlePrevious}
                                disabled={currentStep === 0 && fnolSubStep === 0}
                            >
                                Previous
                            </Button>
                            <Button color="primary" onPress={handleNext} disabled={isLoading}>
                                {isLoading ? "Loading..." : (
                                    isFNOLStep && fnolSubStep < 2 ? "Next" :
                                    currentStep < steps.length - 1 ? "Next Step" : "Finish"
                                )}
                            </Button>
                        </div>
                    </ModalFooter>
                </>
            </ModalContent>
        </Modal>
    );
}
