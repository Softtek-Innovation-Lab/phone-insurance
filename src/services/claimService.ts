import { claimsApi } from "./claimsApi";
import { FNOLData } from "@/components/claims/FNOLForm";

/**
 * Procesa el First Notice of Loss (FNOL) - Primera notificación de pérdida
 * Esta es la única función con lógica real en este servicio.
 * 
 * @param policyNumber El número de póliza para el cual se reporta el FNOL
 * @param data Los datos del formulario FNOL
 * @param claimNo El número de reclamo
 * @param taskId El ID de la tarea
 * @returns Una promesa que se resuelve cuando el proceso se completa
 */
export const processFNOL = async (policyNumber: string, data: FNOLData | null, claimNo?: string, taskId?: string): Promise<any> => {
    if (!data || !claimNo || !taskId) {
        const error = new Error("Missing required data for FNOL submission.");
        (error as any).details = { data, claimNo, taskId };
        throw error;
    }

    try {
        const response = await claimsApi.submitFNOL(claimNo, taskId, data, policyNumber);
        console.log("FNOL submission successful:", response);
        return response;
    } catch (error) {
        console.error("Error in processFNOL:", error);
        throw error;
    }
};

/**
 * Funciones stub para los demás pasos del proceso de reclamos
 * TODO: Implementar la lógica real para cada paso cuando se integre con la API
 */

export const processRegistration = async (policyNumber: string): Promise<void> => {
    console.log(`[STUB] Registration: El reclamo se registra formalmente en el sistema. Policy: ${policyNumber}`);
    // TODO: Implementar llamada a API para registrar el reclamo
};

export const processInvestigation = async (policyNumber: string): Promise<void> => {
    console.log(`[STUB] Investigation: Se recaban detalles y evidencias del siniestro. Policy: ${policyNumber}`);
    // TODO: Implementar llamada a API para investigación
};

export const processAppraisal = async (policyNumber: string): Promise<void> => {
    console.log(`[STUB] Appraisal: Se realiza la tasación o valuación de los daños. Policy: ${policyNumber}`);
    // TODO: Implementar llamada a API para tasación
};

export const processAppraisalApproval = async (policyNumber: string): Promise<void> => {
    console.log(`[STUB] Appraisal Approval: La tasación es revisada y aprobada. Policy: ${policyNumber}`);
    // TODO: Implementar llamada a API para aprobación de tasación
};

export const processDocument = async (policyNumber: string): Promise<void> => {
    console.log(`[STUB] Document: Se generan o solicitan documentos necesarios. Policy: ${policyNumber}`);
    // TODO: Implementar llamada a API para documentación
};

export const processCalculation = async (policyNumber: string): Promise<void> => {
    console.log(`[STUB] Calculation: Cálculo del monto a indemnizar. Policy: ${policyNumber}`);
    // TODO: Implementar llamada a API para cálculo
};

export const processCalculationApproval = async (policyNumber: string): Promise<void> => {
    console.log(`[STUB] Calculation Approval: El cálculo de indemnización es revisado y aprobado. Policy: ${policyNumber}`);
    // TODO: Implementar llamada a API para aprobación de cálculo
};

export const processSettlement = async (policyNumber: string): Promise<void> => {
    console.log(`[STUB] Settlement: Se inicia el proceso de pago o compensación. Policy: ${policyNumber}`);
    // TODO: Implementar llamada a API para liquidación
};

export const processSettlementApproval = async (policyNumber: string): Promise<void> => {
    console.log(`[STUB] Settlement Approval: Aprobación final del pago. Policy: ${policyNumber}`);
    // TODO: Implementar llamada a API para aprobación de liquidación
};

export const processCloseStep = async (policyNumber: string): Promise<void> => {
    console.log(`[STUB] Close: El reclamo se cierra oficialmente. Policy: ${policyNumber}`);
    // TODO: Implementar llamada a API para cerrar el reclamo
};
