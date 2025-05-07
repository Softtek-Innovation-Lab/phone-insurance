import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '@/store';
import { useGlobalStore } from '@/hooks/useGlobalStore';
import { useNotification } from '@/providers/NotificationProvider';
import { createOrSavePolicy } from '@/store/slices/policySlice';
import { FormErrors, FormValues, parseFormValues, validateStep1, validateStep2 } from '../utils';
import { DUMMY_DATA } from '@/components/InsuranceForm/constants';

interface UseInsuranceFormProps {
  product: any;
  useDummyData?: boolean;
}

export const useInsuranceForm = ({ product, useDummyData = false }: UseInsuranceFormProps) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [steps, setSteps] = useState(1);
  const { store, setStore } = useGlobalStore();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
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
        
        try {
          setStore({ cart: [...(store?.cart || []), parsedData] });
          addNotification(`${product.name} ha sido agregado al carrito.`, "success");
          
          setSteps(3);
        } catch (error) {
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