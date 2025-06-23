import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export type FormValues = {
  state: Set<string>;
  coverageAmount: Set<string>;
  deductible: Set<string>;
  policyTerm: Set<string>;
  paymentOption: Set<string>;
  manufacturer: string;
  model: string;
  serialNumber: string;
};

export type FormErrors = {
  [key: string]: string;
};

export const validateStep1 = (formValues: FormValues): FormErrors => {
  const newErrors: FormErrors = {};

  if (formValues.state.size === 0) newErrors.state = "State is required";
  if (formValues.coverageAmount.size === 0) newErrors.coverageAmount = "Coverage amount is required";
  if (formValues.deductible.size === 0) newErrors.deductible = "Deductible is required";
  if (formValues.policyTerm.size === 0) newErrors.policyTerm = "Policy term is required";
  if (formValues.paymentOption.size === 0) newErrors.paymentOption = "Payment option is required";

  return newErrors;
};

export const validateStep2 = (formValues: FormValues): FormErrors => {
  const newErrors: FormErrors = {};

  if (!formValues.manufacturer.trim()) newErrors.manufacturer = "Manufacturer is required";
  if (!formValues.model.trim()) newErrors.model = "Model is required";
  if (!formValues.serialNumber.trim()) newErrors.serialNumber = "Serial number is required";

  return newErrors;
};

interface IconWrapperProps {
  children: ReactNode;
  className?: string;
}

export const IconWrapper = ({ children, className }: IconWrapperProps) => (
  <div
    className={cn(
      className,
      "flex items-center rounded-small justify-center w-7 h-7",
    )}
  >
    {children}
  </div>
);

export const parseFormValues = (formValues: FormValues, product: any) => {
  // Generate a unique ID for each cart item
  const uniqueId = `item-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

  console.log("🆕 === CREATING NEW CART ITEM ===");
  console.log("🆔 Generated unique ID:", uniqueId);
  console.log("📦 Product:", product);
  console.log("📝 Form values:", formValues);

  const parsedItem = {
    ...formValues,
    id: uniqueId, // Add unique ID to each cart item
    state: Array.from(formValues.state)[0] || "",
    coverageAmount: Array.from(formValues.coverageAmount)[0] || "",
    deductible: Array.from(formValues.deductible)[0] || "",
    policyTerm: Array.from(formValues.policyTerm)[0] || "",
    paymentOption: Array.from(formValues.paymentOption)[0] || "",
    product,
  };

  console.log("✅ Final parsed cart item:", parsedItem);
  console.log("🆔 Final item ID:", parsedItem.id);
  console.log("🆕 === END CREATING CART ITEM ===");

  return parsedItem;
};