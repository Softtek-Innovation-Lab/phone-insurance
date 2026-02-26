import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

export interface FNOLData {
    dateOfLoss: string;
    reportDate: string;
    causeOfLoss: string;
    catastropheCode: string;
    contactPerson: string;
    contactNumber: string;
    contactEmail: string;
    otherPolicies: string;
    accidentAddress: string;
    accidentDescription: string;
}

interface FNOLFormProps {
    policyNumber: string;
    productName: string;
    claimNo?: string;
    taskId?: string;
    onDataChange: (data: FNOLData) => void;
    currentSubStep: number;
}

export default function FNOLForm({ policyNumber, productName, claimNo, taskId: _taskId, onDataChange, currentSubStep }: FNOLFormProps) {
    const [formData, setFormData] = useState<FNOLData>({
        dateOfLoss: new Date().toISOString().slice(0, 16),
        reportDate: new Date().toISOString().slice(0, 16),
        causeOfLoss: 'fire',
        catastropheCode: '',
        contactPerson: '',
        contactNumber: '',
        contactEmail: '',
        otherPolicies: 'no',
        accidentAddress: '',
        accidentDescription: '',
    });

    useEffect(() => {
        onDataChange(formData);
    }, [formData, onDataChange]);

    const handleChange = (field: keyof FNOLData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-4">
            {/* Policy Information - Always visible */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b">
                <div>
                    <p className="text-sm font-medium text-gray-500">Task Type</p>
                    <p className="font-semibold">FNOL</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Product</p>
                    <p className="font-semibold">{productName}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Policy No.</p>
                    <p className="font-semibold">{policyNumber}</p>
                </div>
                {claimNo && (
                    <div>
                        <p className="text-sm font-medium text-gray-500">Claim No.</p>
                        <p className="font-semibold">{claimNo}</p>
                    </div>
                )}
            </div>

            {/* Sub-step 1: Basic Claim Information */}
            {currentSubStep === 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Información Básica del Siniestro</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Date of Loss"
                            type="datetime-local"
                            value={formData.dateOfLoss}
                            onChange={(e) => handleChange('dateOfLoss', e.target.value)}
                            isRequired
                        />
                        <Input
                            label="Report Date"
                            type="datetime-local"
                            value={formData.reportDate}
                            isReadOnly
                            isRequired
                        />
                        <Select
                            label="Cause of Loss"
                            isRequired
                            selectedKeys={[formData.causeOfLoss]}
                            onSelectionChange={(keys) => handleChange('causeOfLoss', Array.from(keys)[0] as string)}
                        >
                            <SelectItem key="fire">Fire</SelectItem>
                            <SelectItem key="explosion">Explosion</SelectItem>
                            <SelectItem key="flood">Flood</SelectItem>
                        </Select>
                        <Select
                            label="Catastrophe Code"
                            selectedKeys={formData.catastropheCode ? [formData.catastropheCode] : []}
                            onSelectionChange={(keys) => handleChange('catastropheCode', Array.from(keys)[0] as string)}
                        >
                            <SelectItem key="none">None</SelectItem>
                        </Select>
                    </div>
                    <Select
                        label="Are there any other policies covering you for this accident?"
                        selectedKeys={[formData.otherPolicies]}
                        onSelectionChange={(keys) => handleChange('otherPolicies', Array.from(keys)[0] as string)}
                    >
                        <SelectItem key="no">No</SelectItem>
                        <SelectItem key="yes">Yes</SelectItem>
                    </Select>
                </div>
            )}

            {/* Sub-step 2: Contact Information */}
            {currentSubStep === 1 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Información de Contacto</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <Input
                            label="Contact Person"
                            value={formData.contactPerson}
                            onChange={(e) => handleChange('contactPerson', e.target.value)}
                            placeholder="Nombre completo de la persona de contacto"
                        />
                        <Input
                            label="Contact Number"
                            value={formData.contactNumber}
                            onChange={(e) => handleChange('contactNumber', e.target.value)}
                            placeholder="Número de teléfono"
                        />
                        <Input
                            label="Contact Email"
                            type="email"
                            value={formData.contactEmail}
                            onChange={(e) => handleChange('contactEmail', e.target.value)}
                            placeholder="correo@ejemplo.com"
                        />
                    </div>
                </div>
            )}

            {/* Sub-step 3: Accident Details */}
            {currentSubStep === 2 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Detalles del Accidente</h3>
                    <Input
                        label="Accident Address"
                        value={formData.accidentAddress}
                        onChange={(e) => handleChange('accidentAddress', e.target.value)}
                        placeholder="Dirección donde ocurrió el siniestro"
                    />
                    <div>
                        <label htmlFor="accident-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Accident Description
                        </label>
                        <Textarea
                            id="accident-description"
                            maxLength={2000}
                            className="mt-1"
                            value={formData.accidentDescription}
                            onChange={(e) => handleChange('accidentDescription', e.target.value)}
                            placeholder="Describa detalladamente cómo ocurrió el siniestro..."
                            rows={8}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.accidentDescription.length}/2000 caracteres
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
