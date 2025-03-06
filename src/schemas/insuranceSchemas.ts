// schemas/insuranceSchemas.ts
import { z } from "zod";

// Schema para Step 1 - Información básica
export const step1Schema = z.object({
    firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    phoneNumber: z.string().min(10, "Número de teléfono inválido"),
});

// Schema para Step 2 - Detalles de la póliza
export const step2Schema = z.object({
    manufacturer: z.string().min(1, "Seleccione un fabricante"),
    model: z.string().min(1, "Seleccione un modelo"),
    coverageAmount: z.string().min(1, "Seleccione un monto de cobertura"),
    deductible: z.string().min(1, "Seleccione un deducible"),
});

// Tipo combinado para el formulario completo
export type InsuranceFormData = z.infer<typeof step1Schema> & z.infer<typeof step2Schema>;