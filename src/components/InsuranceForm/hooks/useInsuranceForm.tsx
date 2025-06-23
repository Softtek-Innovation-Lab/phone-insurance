import { DUMMY_DATA } from '@/components/InsuranceForm/constants';
import { useGlobalStore } from '@/hooks/useGlobalStore';
import { useNotification } from '@/providers/NotificationProvider';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormErrors, FormValues, parseFormValues, validateStep1, validateStep2 } from '../utils';

interface UseInsuranceFormProps {
  product: any;
  useDummyData?: boolean;
}

export const useInsuranceForm = ({ product, useDummyData = false }: UseInsuranceFormProps) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [steps, setSteps] = useState(1);
  const { store, setStore } = useGlobalStore();
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const initialFormValues = useDummyData ? DUMMY_DATA : {
    state: new Set<string>(),
    coverageAmount: new Set<string>([`${product.SumInsured}`]),
    deductible: new Set<string>(),
    policyTerm: new Set<string>(),
    paymentOption: new Set<string>(),
    manufacturer: "",
    model: "",
    serialNumber: "",
  };

  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  const coverageAmounts = [
    { key: `${product.SumInsured}`, label: `$${product.SumInsured}.00` },
    { key: `${product.SumInsured * 1.2}`, label: `$${product.SumInsured * 1.2}.00` },
    { key: `${product.SumInsured * 1.5}`, label: `$${product.SumInsured * 1.5}.00` },
  ];

  const updateFormValue = (name: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const resetForm = () => {
    setFormValues(initialFormValues);
    setErrors({});
    setSteps(1);
  };

  const goBack = () => {
    setSteps((prev) => Math.max(prev - 1, 1));
  };

  const navigateToCart = () => {
    navigate('/cart');
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors: FormErrors = {};

    if (steps === 1) {
      newErrors = validateStep1(formValues);
      if (Object.keys(newErrors).length === 0) {
        setSteps(2);
      }
    } else if (steps === 2) {
      newErrors = validateStep2(formValues);
      if (Object.keys(newErrors).length === 0) {
        const parsedData = parseFormValues(formValues, product);

        console.log("🛒 === ADDING TO CART ===");
        console.log("📦 Parsed data to add:", parsedData);
        console.log("🆔 New item ID:", parsedData.id);
        console.log("🛒 Current cart before adding:", store?.cart);
        console.log("🆔 Current cart IDs:", store?.cart?.map(item => `"${item.id}"`));

        try {
          const newCart = [...(store?.cart ?? []), parsedData];
          console.log("🛒 New cart after adding:", newCart);
          console.log("🆔 New cart IDs:", newCart.map(item => `"${item.id}"`));

          setStore({ cart: newCart });
          addNotification(`${product.name} has been added to cart.`, "success");

          console.log("✅ Item added successfully to cart");
          console.log("🛒 === END ADDING TO CART ===");
          setSteps(3);
        } catch (error) {
          console.error("❌ Error adding to cart:", error);
          newErrors.api = "Failed to create policy. Please try again.";
        }
      }
    }

    setErrors(newErrors);
  };

  return {
    steps,
    errors,
    formValues,
    coverageAmounts,
    updateFormValue,
    resetForm,
    goBack,
    navigateToCart,
    submitForm
  };
};