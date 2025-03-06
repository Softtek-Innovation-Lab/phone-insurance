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
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Static text content
const TEXT_CONTENT = {
  title: "Phone Insurance",
  subtitle: "Protect your device with comprehensive coverage",
  lossesTitle: "Losses Covered",
  quoteTitle: "Get a no-obligation quote",
  quoteDescription:
    "Make sure your valuable personal electronic devices are protected! Mishaps can happen at any time, Worth Ave. Group can protect your Phone against cracked screens, spills, theft and more!",
  disclaimer: "",
};

const AVAILABLE_OPTIONS = {
  states: [
    { key: "Maine", label: "Maine" },
    { key: "California", label: "California" },
    { key: "New York", label: "New York" },
    { key: "Texas", label: "Texas" }
  ],
  coverageAmounts: [
    { key: "$649.00", label: "$649.00" },
    { key: "$799.00", label: "$799.00" },
    { key: "$999.00", label: "$999.00" }
  ],
  deductibles: [
    { key: "$75", label: "$75" },
    { key: "$100", label: "$100" },
    { key: "$150", label: "$150" }
  ],
  policyTerms: [
    { key: "1 Year", label: "1 Year" },
    { key: "2 Year", label: "2 Year" },
    { key: "3 Year", label: "3 Year" }
  ],
  paymentOptions: [
    { key: "Annual One-Time", label: "Annual One-Time" },
    { key: "Monthly", label: "Monthly" },
    { key: "Quarterly", label: "Quarterly" }
  ]
};

// Lista de servicios
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

export default function IndexPage() {
  const [errors, setErrors] = useState({}) as any
  const { store, setStore, clearStore } = useGlobalStore();
  const navigate = useNavigate();
  const [steps, setSteps] = useState(1);

  const [formValues, setFormValues] = useState({
    state: new Set([]),
    coverageAmount: new Set([]),
    deductible: new Set([]),
    policyTerm: new Set([]),
    paymentOption: new Set([]),

    manufacturer: "",
    model: "",
    serialNumber: ""
  });
  console.log(formValues)
  const updateFormValue = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };



  const onSubmit = (e) => {
    e.preventDefault();
    const data = formValues
    const newErrors = {} as any;

    if (steps === 2) { //onFinish
      const parsedData = {
        ...data,
        state: Array.from(data.state)[0],
        coverageAmount: Array.from(data.coverageAmount)[0],
        deductible: Array.from(data.deductible)[0],
        policyTerm: Array.from(data.policyTerm)[0],
        paymentOption: Array.from(data.paymentOption)[0],
      };
      setStore({ cart: [...store?.cart || [], parsedData] });
    }


    setSteps(steps + 1)
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
          {/* Columna izquierda: Imagen y lista de servicios */}
          <div className="col-span-4 flex flex-col gap-4">
            <Card className="py-4">
              <CardBody className="overflow-visible py-2">
                <Image
                  alt="Card background"
                  className="object-cover rounded-xl"
                  src="https://img.freepik.com/free-vector/customer-getting-insurance-coverage-protection-using-smartphone-demand-insurance-online-policy-personalized-isurance-service-concept-pinkish-coral-bluevector-isolated-illustration_335657-1337.jpg?t=st=1741198135~exp=1741201735~hmac=656c113ef59d13b16d5f4caae72784ee9dca60e2220ea96fc017a1d68f1ac80f&w=1060"
                  width={270}
                />
                <div className="flex flex-col  self-center">
                  <h4 className="font-bold text-large">{TEXT_CONTENT.title}</h4>
                  <small className="text-default-500">
                    {TEXT_CONTENT.subtitle}
                  </small>
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
                        startContent={
                          <IconWrapper className={service.color}>
                            {service.icon}
                          </IconWrapper>
                        }
                      >
                        {service.label}
                      </ListboxItem>
                    ))}
                  </Listbox>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Columna derecha: Formulario en dos columnas */}
          <div className="col-span-8 ">
            <Card className="p-4 h-full ">
              <h2 className="font-bold text-xl mb-4">
                {TEXT_CONTENT.quoteTitle}
              </h2>
              <p className="text-default-500 mb-4">
                {TEXT_CONTENT.quoteDescription}
              </p>
              <Form
                className="w-full space-y-4"
                validationErrors={errors}
                onReset={() => setSteps(1)}
                onSubmit={onSubmit}
              >
                {steps === 1 && <div className="w-full grid grid-cols-2 gap-4">

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
                    {(state) => (
                      <SelectItem key={state.key}>
                        {state.label}
                      </SelectItem>
                    )}
                  </Select>

                  <Select
                    isRequired
                    label="Coverage Amount"
                    labelPlacement="outside"
                    name="coverageAmount"
                    placeholder="Select coverage amount"
                    items={AVAILABLE_OPTIONS.coverageAmounts}
                    onSelectionChange={(value) => updateFormValue("coverageAmount", value)}
                    selectedKeys={formValues.coverageAmount}

                  >
                    {(coverageAmount) => (
                      <SelectItem key={coverageAmount.key}>
                        {coverageAmount.label}
                      </SelectItem>
                    )}
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
                    {(deductible) => (
                      <SelectItem key={deductible.key}>
                        {deductible.label}
                      </SelectItem>
                    )}

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
                    {(policyTerm) => (
                      <SelectItem key={policyTerm.key}>
                        {policyTerm.label}
                      </SelectItem>
                    )}
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
                    {(paymentOption) => (
                      <SelectItem key={paymentOption.key}>
                        {paymentOption.label}
                      </SelectItem>
                    )}
                  </Select>

                </div>}

                {steps === 2 && <div className="w-full grid grid-cols-2 gap-4">
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
                </div>}

                {steps === 3 && (
                  <div className="w-full grid grid-cols-1 gap-4">
                    <div className="flex flex-col items-center justify-center p-6 bg-success/10 rounded-medium">
                      <h3 className="text-xl font-bold text-success mb-2">
                        Application Completed!
                      </h3>
                      <p className="text-default-600 text-center">
                        Thank you for choosing our phone insurance. We have successfully received your application.
                        You will soon receive an email with your policy details and next steps.
                        Your device is on its way to being protected!
                      </p>
                      <Button
                        color="success"
                        className="mt-4 text-white"
                        onClick={() => {
                          navigate("/cart");
                        }}
                      >
                        Go to cart
                      </Button>
                    </div>
                  </div>
                )}

                {steps !== 3 && <div className="flex gap-4">
                  <Button className="w-full" color="primary" type="submit">
                    {steps === 1 ? "Next" : "Submit"}
                  </Button>
                  <Button variant="bordered"
                    onPress={() => {
                      if (steps === 1) {
                        setFormValues({
                          state: new Set([]),
                          coverageAmount: new Set([]),
                          deductible: new Set([]),
                          policyTerm: new Set([]),
                          paymentOption: new Set([]),

                          manufacturer: "",
                          model: "",
                          serialNumber: ""
                        });
                      } else {
                        setSteps(steps - 1)
                      }
                    }}
                  >
                    {steps === 1 ? "Reset" : "Back"}
                  </Button>
                </div>}

                <p className="text-tiny text-warning">
                  {TEXT_CONTENT.disclaimer}
                </p>


              </Form>
            </Card>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
