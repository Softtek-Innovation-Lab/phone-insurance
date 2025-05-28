// schemas/insuranceSchemas.ts
import { z } from "zod";

// Schema para Step 1 - Información básica
export const step1Schema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    phoneNumber: z.string().min(10, "Invalid phone number"),
});

// Schema for Step 2 - Policy details
export const step2Schema = z.object({
    manufacturer: z.string().min(1, "Select a manufacturer"),
    model: z.string().min(1, "Select a model"),
    coverageAmount: z.string().min(1, "Select a coverage amount"),
    deductible: z.string().min(1, "Select a deductible"),
});

// Combined type for the complete form
export type InsuranceFormData = z.infer<typeof step1Schema> & z.infer<typeof step2Schema>;