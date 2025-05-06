import { Select, SelectItem } from "@heroui/select";
import { AVAILABLE_OPTIONS } from "../constants";
import { FormErrors, FormValues } from "../utils";

interface Step1FormProps {
  formValues: FormValues;
  errors: FormErrors;
  updateFormValue: (name: string, value: any) => void;
  coverageAmounts: { key: string; label: string }[];
}

export const Step1Form = ({ 
  formValues, 
  errors, 
  updateFormValue, 
  coverageAmounts 
}: Step1FormProps) => {
  return (
    <div className="w-full grid grid-cols-2 gap-4">
      <Select
        isRequired
        label="State"
        labelPlacement="outside"
        name="state"
        placeholder="Select your state"
        items={AVAILABLE_OPTIONS.states}
        onSelectionChange={(value) => updateFormValue("state", value)}
        selectedKeys={formValues.state}
        errorMessage={errors.state}
        isInvalid={!!errors.state}
      >
        {(state) => <SelectItem key={state.key}>{state.label}</SelectItem>}
      </Select>

      <Select
        isRequired
        label="Coverage Amount"
        labelPlacement="outside"
        name="coverageAmount"
        placeholder="Select coverage amount"
        items={coverageAmounts}
        onSelectionChange={(value) => updateFormValue("coverageAmount", value)}
        selectedKeys={formValues.coverageAmount}
        errorMessage={errors.coverageAmount}
        isInvalid={!!errors.coverageAmount}
      >
        {(coverageAmount) => <SelectItem key={coverageAmount.key}>{coverageAmount.label}</SelectItem>}
      </Select>

      <Select
        isRequired
        label="Deductible"
        labelPlacement="outside"
        name="deductible"
        placeholder="Select deductible"
        items={AVAILABLE_OPTIONS.deductibles}
        onSelectionChange={(value) => updateFormValue("deductible", value)}
        selectedKeys={formValues.deductible}
        errorMessage={errors.deductible}
        isInvalid={!!errors.deductible}
      >
        {(deductible) => <SelectItem key={deductible.key}>{deductible.label}</SelectItem>}
      </Select>

      <Select
        isRequired
        label="Policy Term"
        labelPlacement="outside"
        name="policyTerm"
        placeholder="Select policy term"
        items={AVAILABLE_OPTIONS.policyTerms}
        onSelectionChange={(value) => updateFormValue("policyTerm", value)}
        selectedKeys={formValues.policyTerm}
        errorMessage={errors.policyTerm}
        isInvalid={!!errors.policyTerm}
      >
        {(policyTerm) => <SelectItem key={policyTerm.key}>{policyTerm.label}</SelectItem>}
      </Select>

      <Select
        isRequired
        label="Payment Option"
        labelPlacement="outside"
        name="paymentOption"
        placeholder="Select payment option"
        items={AVAILABLE_OPTIONS.paymentOptions}
        onSelectionChange={(value) => updateFormValue("paymentOption", value)}
        selectedKeys={formValues.paymentOption}
        errorMessage={errors.paymentOption}
        isInvalid={!!errors.paymentOption}
      >
        {(paymentOption) => <SelectItem key={paymentOption.key}>{paymentOption.label}</SelectItem>}
      </Select>
    </div>
  );
};