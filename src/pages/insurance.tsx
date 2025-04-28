import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Form } from "@heroui/form";
import { Image } from "@heroui/image";
import { Select, SelectItem } from "@heroui/select";
import { cn } from "@heroui/theme";
import { useGlobalStore } from "@/hooks/useGlobalStore";
import DefaultLayout from "@/layouts/default";
import { Input } from "@heroui/input";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { BugIcon, Droplets, FlameKindling, MonitorX, ShieldAlert, UtilityPole } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { createOrSavePolicy } from "@/store/slices/policySlice";
import { products } from '@/data/products';

const TEXT_CONTENT = {
  subtitle: "Protect your device with comprehensive coverage",
  lossesTitle: "Losses Covered",
  quoteTitle: "Get a no-obligation quote",
  quoteDescription:
    "Make sure your valuable personal electronic devices are protected! Mishaps can happen at any time, Worth Ave. Group can protect your device against cracked screens, spills, theft and more!",
  disclaimer: "",
};

const AVAILABLE_OPTIONS = {
  states: [
    { key: "Maine", label: "Maine" },
    { key: "California", label: "California" },
    { key: "New York", label: "New York" },
    { key: "Texas", label: "Texas" },
  ],
  deductibles: [
    { key: "$75", label: "$75" },
    { key: "$100", label: "$100" },
    { key: "$150", label: "$150" },
  ],
  policyTerms: [
    { key: "1 Year", label: "1 Year" },
    { key: "2 Year", label: "2 Year" },
    { key: "3 Year", label: "3 Year" },
  ],
  paymentOptions: [
    { key: "Annual One-Time", label: "Annual One-Time" },
    { key: "Monthly", label: "Monthly" },
    { key: "Quarterly", label: "Quarterly" },
  ],
};

const SERVICES = [
  {
    key: "cracked_screens",
    label: "Cracked Screens",
    icon: <MonitorX className="text-lg" />,
    color: "bg-primary/10 text-primary",
  },
  {
    key: "spills_liquid",
    label: "Spills & Liquid Submersion",
    icon: <Droplets className="text-lg" />,
    color: "bg-warning/10 text-warning",
  },
  {
    key: "accidental_damage",
    label: "Accidental Damage (Drops)",
    icon: <BugIcon className="text-lg" />,
    color: "bg-danger/10 text-danger",
  },
  {
    key: "theft_vandalism",
    label: "Theft & Vandalism",
    icon: <ShieldAlert className="text-lg" />,
    color: "bg-success/10 text-success",
  },
  {
    key: "natural_disasters",
    label: "Fire, Flood & Natural Disasters",
    icon: <FlameKindling className="text-lg" />,
    color: "bg-secondary/10 text-secondary",
  },
  {
    key: "power_surge",
    label: "Power Surge By Lightning",
    icon: <UtilityPole className="text-lg" />,
    color: "bg-default/50 text-foreground",
  },
];

const IconWrapper = ({ children, className }: any) => (
  <div
    className={cn(
      className,
      "flex items-center rounded-small justify-center w-7 h-7",
    )}
  >
    {children}
  </div>
);

export default function InsurancePage() {
  const [errors, setErrors] = useState({});
  const { store, setStore } = useGlobalStore();
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [steps, setSteps] = useState(1);

  const product = products.find(p => p.ProductId === parseInt(productId || '')) || {
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const coverageAmounts = [
    { key: `${product.SumInsured}`, label: `$${product.SumInsured}.00` },
    { key: `${product.SumInsured * 1.2}`, label: `$${product.SumInsured * 1.2}.00` },
    { key: `${product.SumInsured * 1.5}`, label: `$${product.SumInsured * 1.5}.00` },
  ];

  const [formValues, setFormValues] = useState({
    state: new Set([]),
    coverageAmount: new Set([`${product.SumInsured}`]),
    deductible: new Set([]),
    policyTerm: new Set([]),
    paymentOption: new Set([]),
    manufacturer: "",
    model: "",
    serialNumber: "",
  });

  const updateFormValue = (name: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};

    if (steps === 2) {
      const parsedData = {
        ...formValues,
        state: Array.from(formValues.state)[0],
        coverageAmount: Array.from(formValues.coverageAmount)[0],
        deductible: Array.from(formValues.deductible)[0],
        policyTerm: Array.from(formValues.policyTerm)[0],
        paymentOption: Array.from(formValues.paymentOption)[0],
        product,
      };

      const policyData = {
        BusinessCateCode: "1",
        EffectiveDate: "2025-04-25",
        ExpiryDate: "2026-04-24T23:59:59",
        OrgCode: "softtek",
        POIRate: 1,
        PolicyCustomerList: [
          {
            CustomerName: "Richard Vives",
            DateOfBirth: "1975-04-21",
            GenderCode: "M",
            IdNo: "123456789",
            IdType: "1",
            IsInsured: "N",
            IsOrgParty: "N",
            IsPolicyHolder: "Y",
            VersionSeq: 1,
            TempData: {
              "Mask-IdNo": "Hy4eAmtfvwRJLr3TzyvcZA==",
              "MaskAfter-IdNo": "123456789",
            },
          },
        ],
        PolicyLobList: [
          {
            PolicyRiskList: [
              {
                PolicyCoverageList: [
                  {
                    PolicyLimitDeductibleList: [
                      {
                        LimitDeductibleValue: parseFloat(parsedData.coverageAmount),
                        ProductElementCode: "PROP_FULL_DAMAGE_LIM",
                        ProductElementId: 789611476,
                      },
                    ],
                    ProductElementCode: "TRAV_PROP_COV",
                    SumInsured: parseFloat(parsedData.coverageAmount),
                    VersionSeq: 1,
                  },
                ],
                ProductElementCode: product.ProductElementCode,
                ProductElementId: product.ProductElementId,
                RiskName: "ProductElement",
                VersionSeq: 1,
                PredefinedPremium: product.PredefinedPremium,
              },
            ],
            ProductCode: product.ProductCode,
            ProductElementCode: product.ProductCode,
            ProductId: product.ProductId,
            TechProductCode: product.TechProductCode,
            TechProductId: product.TechProductId,
            VersionSeq: 1,
          },
        ],
        ProductCode: product.ProductCode,
        ProductId: product.ProductId,
        ProductVersion: "1.0",
        ProposalDate: "2025-04-24",
        TechProductCode: product.TechProductCode,
        TechProductId: product.TechProductId,
        VersionSeq: 1,
      };

      try {
        await dispatch(createOrSavePolicy(policyData)).unwrap();
        setStore({ cart: [...(store?.cart || []), parsedData] });
        setSteps(3);
      } catch (error) {
        newErrors.api = "Failed to create policy";
      }
    } else {
      setSteps(steps + 1);
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="grid grid-cols-12 gap-6 max-w-6xl w-full">
          <div className="col-span-4 flex flex-col gap-4">
            <Card className="py-4">
              <CardBody className="overflow-visible py-2 items-center">
                <Image
                  alt={product.name}
                  className="object-cover rounded-xl"
                  src={product.image}
                  width={270}
                />
                <div className="flex flex-col self-center">
                  <h4 className="font-bold text-large">{product.name}</h4>
                  <small className="text-default-500">{TEXT_CONTENT.subtitle}</small>
                  <p className="text-tiny uppercase font-bold mt-4 mb-2">
                    {TEXT_CONTENT.lossesTitle}
                  </p>
                  <Listbox
                    aria-label="Services Covered"
                    className="p-0 gap-0 bg-content1 max-w-[300px] overflow-visible shadow-small rounded-medium"
                    itemClasses={{
                      base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80",
                    }}
                  >
                    {SERVICES.map((service) => (
                      <ListboxItem
                        key={service.key}
                        startContent={<IconWrapper className={service.color}>{service.icon}</IconWrapper>}
                      >
                        {service.label}
                      </ListboxItem>
                    ))}
                  </Listbox>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="col-span-8">
            <Card className="p-4 h-full">
              <h2 className="font-bold text-xl mb-4">{TEXT_CONTENT.quoteTitle}</h2>
              <p className="text-default-500 mb-4">{TEXT_CONTENT.quoteDescription}</p>
              <Form
                className="w-full space-y-4"
                validationErrors={errors}
                onReset={() => setSteps(1)}
                onSubmit={onSubmit}
              >
                {steps === 1 && (
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
                    >
                      {(paymentOption) => <SelectItem key={paymentOption.key}>{paymentOption.label}</SelectItem>}
                    </Select>
                  </div>
                )}

                {steps === 2 && (
                  <div className="w-full grid grid-cols-2 gap-4">
                    <Input
                      isRequired
                      label="Manufacturer"
                      labelPlacement="outside"
                      name="manufacturer"
                      placeholder="Enter manufacturer"
                      onValueChange={(value) => updateFormValue("manufacturer", value)}
                      value={formValues.manufacturer}
                    />
                    <Input
                      isRequired
                      label="Model"
                      labelPlacement="outside"
                      name="model"
                      placeholder="Enter model"
                      value={formValues.model}
                      onValueChange={(value) => updateFormValue("model", value)}
                    />
                    <Input
                      isRequired
                      label="Device Serial Number"
                      labelPlacement="outside"
                      name="serialNumber"
                      placeholder="Enter serial number"
                      value={formValues.serialNumber}
                      onValueChange={(value) => updateFormValue("serialNumber", value)}
                    />
                  </div>
                )}

                {steps === 3 && (
                  <div className="w-full grid grid-cols-1 gap-4">
                    <div className="flex flex-col items-center justify-center p-6 bg-success/10 rounded-medium">
                      <h3 className="text-xl font-bold text-success mb-2">Application Completed!</h3>
                      <p className="text-default-600 text-center">
                        Thank you for choosing our {product.name.toLowerCase()}. We have successfully received your application.
                        You will soon receive an email with your policy details and next steps.
                        Your device is on its way to being protected!
                      </p>
                      <Button
                        color="success"
                        className="mt-4 text-white"
                        onClick={() => navigate("/cart")}
                      >
                        Go to cart
                      </Button>
                    </div>
                  </div>
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
                          setFormValues({
                            state: new Set([]),
                            coverageAmount: new Set([`${product.SumInsured}`]),
                            deductible: new Set([]),
                            policyTerm: new Set([]),
                            paymentOption: new Set([]),
                            manufacturer: "",
                            model: "",
                            serialNumber: "",
                          });
                        } else {
                          setSteps(steps - 1);
                        }
                      }}
                    >
                      {steps === 1 ? "Reset" : "Back"}
                    </Button>
                  </div>
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