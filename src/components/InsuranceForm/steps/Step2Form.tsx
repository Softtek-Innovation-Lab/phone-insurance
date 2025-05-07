import { Input } from "@heroui/input";
import { FormErrors, FormValues } from "../utils";

interface Step2FormProps {
  formValues: FormValues;
  errors: FormErrors;
  updateFormValue: (name: string, value: any) => void;
}

export const Step2Form = ({ 
  formValues, 
  errors, 
  updateFormValue 
}: Step2FormProps) => {
  return (
    <div className="w-full grid grid-cols-2 gap-4">
      <Input
        isRequired
        label="Manufacturer"
        labelPlacement="outside"
        name="manufacturer"
        placeholder="Enter manufacturer"
        onValueChange={(value) => updateFormValue("manufacturer", value)}
        value={formValues.manufacturer}
        errorMessage={errors.manufacturer}
        isInvalid={!!errors.manufacturer}
      />
      <Input
        isRequired
        label="Model"
        labelPlacement="outside"
        name="model"
        placeholder="Enter model"
        value={formValues.model}
        onValueChange={(value) => updateFormValue("model", value)}
        errorMessage={errors.model}
        isInvalid={!!errors.model}
      />
      <Input
        isRequired
        label="Device Serial Number"
        labelPlacement="outside"
        name="serialNumber"
        placeholder="Enter serial number"
        value={formValues.serialNumber}
        onValueChange={(value) => updateFormValue("serialNumber", value)}
        errorMessage={errors.serialNumber}
        isInvalid={!!errors.serialNumber}
      />
    </div>
  );
};