import { TEXT_CONTENT } from "@/components/InsuranceForm/constants";
import { useInsuranceForm } from "@/components/InsuranceForm/hooks/useInsuranceForm";
import { ProductInfo } from "@/components/InsuranceForm/ProductInfo";
import { ConfirmationStep } from "@/components/InsuranceForm/steps/ConfirmationStep";
import { Step1Form } from "@/components/InsuranceForm/steps/Step1Form";
import { Step2Form } from "@/components/InsuranceForm/steps/Step2Form";
import { products } from "@/data/products";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Form } from "@heroui/form";
import { Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function InsurancePage() {
  const { productId } = useParams<{ productId: string }>();
  const [isLoading, setIsLoading] = useState(false);

  // Encontrar el producto por ID o usar producto por defecto
  const product = products.find((p) => p.ProductId === parseInt(productId ?? "")) ?? {
    name: "Default Device Insurance",
    image: "/placeholder.svg",
    SumInsured: 1000,
    PredefinedPremium: 100,
    LimitDeductibleValue: 1000,
    ProductCode: "TRAV_PROP_MKT_DEFAULT",
    ProductId: 789725307,
    TechProductCode: "TRAV_PROP_TEC_DEFAULT",
    TechProductId: 789317612,
    ProductElementCode: "TRAV_PROP_RISK_DEFAULT",
    ProductElementId: 789611472,
  };

  // Usar nuestro hook personalizado con datos de prueba habilitados
  const {
    steps,
    errors,
    formValues,
    coverageAmounts,
    updateFormValue,
    resetForm,
    goBack,
    navigateToCart,
    submitForm
  } = useInsuranceForm({
    product,
    useDummyData: true
  });

  // Scroll al inicio cuando el componente se crea
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stepLabels = ["Device Info", "Personal Details", "Confirmation"];

  const breadcrumbItems = [
    { label: "Products", href: "/" },
    { label: product.name, icon: <Shield size={16} /> }
  ];

  const handleSubmit = async (e: any) => {
    setIsLoading(true);
    try {
      await submitForm(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="grid grid-cols-12 gap-6 max-w-6xl w-full">
          <div className="col-span-4 flex flex-col gap-4">
            <ProductInfo product={product} />
          </div>

          <div className="col-span-8">
            <Card className="p-4 h-full">
              <h2 className="font-bold text-xl mb-4">{TEXT_CONTENT.quoteTitle}</h2>
              <p className="text-default-500 mb-4">{TEXT_CONTENT.quoteDescription}</p>
              <Form
                className="w-full space-y-4"
                validationErrors={errors}
                onReset={() => resetForm()}
                onSubmit={submitForm}
              >
                {steps === 1 && (
                  <Step1Form
                    formValues={formValues}
                    errors={errors}
                    updateFormValue={updateFormValue}
                    coverageAmounts={coverageAmounts}
                  />
                )}

                {steps === 2 && (
                  <Step2Form
                    formValues={formValues}
                    errors={errors}
                    updateFormValue={updateFormValue}
                  />
                )}

                {steps === 3 && (
                  <ConfirmationStep
                    productName={product.name}
                    navigateToCart={navigateToCart}
                  />
                )}

                {steps !== 3 && (
                  <div className="flex gap-4">
                    <Button className="w-full" color="primary" type="submit">
                      {steps === 1 ? "Next" : "Submit"}
                    </Button>
                    <Button
                      variant="bordered"
                      onPress={() => {
                        if (steps === 1) {
                          resetForm();
                        } else {
                          goBack();
                        }
                      }}
                    >
                      {steps === 1 ? "Reset" : "Back"}
                    </Button>
                  </div>
                )}

                {errors.api && (
                  <p className="text-tiny text-danger">{errors.api}</p>
                )}
                <p className="text-tiny text-warning">{TEXT_CONTENT.disclaimer}</p>
              </Form>
            </Card>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}