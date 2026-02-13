import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { processHomeInsuranceApplication } from "@/services/homeInsuranceService";
import type { HomeInsuranceFormData, SelectedCoverage } from "@/types/homeInsurance";
import { useNotification } from "@/providers/NotificationProvider";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { useDisclosure } from "@heroui/use-disclosure";

export default function HomeInsurancePage() {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isPaymentOpen, onOpen: onPaymentOpen, onClose: onPaymentClose } = useDisclosure();
  const [calculationData, setCalculationData] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [confirmResolve, setConfirmResolve] = useState<((value: boolean) => void) | null>(null);
  const [paymentResolve, setPaymentResolve] = useState<((value: boolean) => void) | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Lista de coberturas disponibles
  const [availableCoverages, setAvailableCoverages] = useState<SelectedCoverage[]>([
    { ProductElementCode: "HOUSEFIRE_COV", CoverageName: "Incendio Edificio", SumInsured: 0, selected: false },
    { ProductElementCode: "HOUSEFIRECONTENT_COV", CoverageName: "Incendio Contenidos", SumInsured: 0, selected: false },
    { ProductElementCode: "HOUSELIABILITYFAM_COV", CoverageName: "Responsabilidad Civil Familiar", SumInsured: 0, selected: false },
    { ProductElementCode: "HOUSEHOMECARE_COV", CoverageName: "Asistencia Domiciliaria", SumInsured: 0, selected: false },
    { ProductElementCode: "HOUSEBURGLARY_COV", CoverageName: "Robo / Hurto", SumInsured: 0, selected: false },
    { ProductElementCode: "HOUSEFLOOD_COV", CoverageName: "Daños por Agua", SumInsured: 0, selected: false },
    { ProductElementCode: "HOUSECRYSTALGLASS_COV", CoverageName: "Cristales", SumInsured: 0, selected: false },
    { ProductElementCode: "HOUSEDEBRISREMOVAL_COV", CoverageName: "Remoción de Escombros", SumInsured: 0, selected: false },
    { ProductElementCode: "HOUSETEMPACCOMMOD_COV", CoverageName: "Alojamiento Temporal", SumInsured: 0, selected: false },
    { ProductElementCode: "HOUSENATURPHENOM_COV", CoverageName: "Fenómenos Naturales", SumInsured: 0, selected: false },
    { ProductElementCode: "HOUSEELECTROEQUIELECTRO_COV", CoverageName: "Electrodomésticos / Equipos electrónicos", SumInsured: 0, selected: false },
    { ProductElementCode: "HOUSEJEWERLYVALUES_COV", CoverageName: "Joyas y Objetos de Valor", SumInsured: 0, selected: false },
    { ProductElementCode: "HOUSESWIMPOOLTRAMPO_COV", CoverageName: "Piscina / Trampolín", SumInsured: 0, selected: false },
  ]);
  
  // Pack seleccionado
  const [selectedPack, setSelectedPack] = useState<string>("custom");
  
  // Definición de packs
  const coveragePacks = {
    basic: {
      name: "HOGAR BÁSICO",
      description: "Protección esencial para tu hogar",
      coverages: ["HOUSEFIRE_COV", "HOUSEFIRECONTENT_COV", "HOUSELIABILITYFAM_COV", "HOUSEHOMECARE_COV"]
    },
    standard: {
      name: "HOGAR ESTÁNDAR",
      description: "Protección completa con coberturas adicionales",
      coverages: [
        "HOUSEFIRE_COV", "HOUSEFIRECONTENT_COV", "HOUSELIABILITYFAM_COV", "HOUSEHOMECARE_COV",
        "HOUSEBURGLARY_COV", "HOUSEFLOOD_COV", "HOUSECRYSTALGLASS_COV", "HOUSEDEBRISREMOVAL_COV",
        "HOUSETEMPACCOMMOD_COV"
      ]
    },
    plus: {
      name: "HOGAR PLUS",
      description: "Mayor protección con cobertura para fenómenos naturales",
      coverages: [
        "HOUSEFIRE_COV", "HOUSEFIRECONTENT_COV", "HOUSELIABILITYFAM_COV", "HOUSEHOMECARE_COV",
        "HOUSEBURGLARY_COV", "HOUSEFLOOD_COV", "HOUSECRYSTALGLASS_COV", "HOUSEDEBRISREMOVAL_COV",
        "HOUSETEMPACCOMMOD_COV", "HOUSENATURPHENOM_COV", "HOUSEELECTROEQUIELECTRO_COV"
      ]
    },
    premium: {
      name: "HOGAR PREMIUM",
      description: "Protección total para tu hogar y bienes de valor",
      coverages: [
        "HOUSEFIRE_COV", "HOUSEFIRECONTENT_COV", "HOUSELIABILITYFAM_COV", "HOUSEHOMECARE_COV",
        "HOUSEBURGLARY_COV", "HOUSEFLOOD_COV", "HOUSECRYSTALGLASS_COV", "HOUSEDEBRISREMOVAL_COV",
        "HOUSETEMPACCOMMOD_COV", "HOUSENATURPHENOM_COV", "HOUSEELECTROEQUIELECTRO_COV",
        "HOUSEJEWERLYVALUES_COV", "HOUSESWIMPOOLTRAMPO_COV"
      ]
    }
  };
  
  // Datos del formulario
  const [formData, setFormData] = useState<Partial<HomeInsuranceFormData>>({
    homeType: "Singlefamilyhome",
    isPropertyOccupied: "1",
    dwellingUseTo: "Housing",
    haveGarage: "Y",
    propertyInFloodZone: "0",
    antiTheftAlarm: "0",
    securityBars: "N",
    securityCameras: "N",
    fireExtinguishers: "N",
    haveFireAlarm: "0",
    sprinkler: "N",
    doorsLocks: "Y",
    safe: "N",
    animals: "0",
    thereIsSwimmingPool: "0",
    constructionType: "Concrete",
    country: "PER",
    selectedCoverages: [],
  });

  const updateField = (field: keyof HomeInsuranceFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Función de confirmación que muestra el modal
  const handleCalculationConfirmation = async (calcData: any): Promise<boolean> => {
    return new Promise((resolve) => {
      setCalculationData(calcData);
      setConfirmResolve(() => resolve);
      onOpen();
    });
  };

  // Handler para confirmar la póliza
  const handleConfirm = () => {
    if (confirmResolve) {
      confirmResolve(true);
      setConfirmResolve(null);
    }
    onClose();
  };

  // Handler para cancelar la póliza
  const handleCancel = () => {
    if (confirmResolve) {
      confirmResolve(false);
      setConfirmResolve(null);
    }
    onClose();
    setLoading(false);
  };

  // Función de pago que muestra el modal de pago
  const handlePaymentConfirmation = async (payData: any): Promise<boolean> => {
    return new Promise((resolve) => {
      setPaymentData(payData);
      setPaymentResolve(() => resolve);
      onPaymentOpen();
    });
  };

  // Handler para confirmar el pago
  const handlePaymentConfirm = async () => {
    if (!cardNumber || !cardExpiry || !cardCVV || !cardName) {
      addNotification("Please fill all card details", "error");
      return;
    }

    setIsProcessingPayment(true);
    
    // Simular procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessingPayment(false);
    
    if (paymentResolve) {
      paymentResolve(true);
      setPaymentResolve(null);
    }
    
    // Limpiar datos de tarjeta
    setCardNumber('');
    setCardExpiry('');
    setCardCVV('');
    setCardName('');
    
    onPaymentClose();
  };

  // Handler para cancelar el pago
  const handlePaymentCancel = () => {
    if (paymentResolve) {
      paymentResolve(false);
      setPaymentResolve(null);
    }
    onPaymentClose();
    setLoading(false);
  };

  // Función para manejar cambios en coberturas
  const handleCoverageToggle = (code: string) => {
    // Si se modifica manualmente, cambiar a custom
    if (selectedPack !== "custom") {
      setSelectedPack("custom");
    }
    
    setAvailableCoverages(prev =>
      prev.map(cov =>
        cov.ProductElementCode === code
          ? { ...cov, selected: !cov.selected }
          : cov
      )
    );
  };

  const handleCoverageSumInsured = (code: string, value: number) => {
    setAvailableCoverages(prev =>
      prev.map(cov =>
        cov.ProductElementCode === code
          ? { ...cov, SumInsured: value }
          : cov
      )
    );
  };

  // Función para seleccionar un pack
  const handlePackSelection = (packKey: string) => {
    setSelectedPack(packKey);
    
    const packData = coveragePacks[packKey as keyof typeof coveragePacks];
    
    if (packKey === "custom") {
      // No hacer nada, dejar que el usuario seleccione manualmente
      return;
    }
    
    // Auto-seleccionar coberturas del pack
    setAvailableCoverages(prev =>
      prev.map(cov => {
        const isInPack = packData.coverages.includes(cov.ProductElementCode);
        
        if (isInPack) {
          // Auto-completar valores según el tipo de cobertura
          let sumInsured = cov.SumInsured || 0;
          
          // Incendio edificio y contenidos: usar valor de la propiedad
          if (cov.ProductElementCode === "HOUSEFIRE_COV" || cov.ProductElementCode === "HOUSEFIRECONTENT_COV") {
            sumInsured = formData.totalPrice || 0;
          }
          // Fenómenos naturales: usar valor de la propiedad
          else if (cov.ProductElementCode === "HOUSENATURPHENOM_COV") {
            sumInsured = formData.totalPrice || 0;
          }
          // Electrodomésticos: usar valor ingresado
          else if (cov.ProductElementCode === "HOUSEELECTROEQUIELECTRO_COV") {
            sumInsured = formData.electronicEquipment || 0;
          }
          // Joyas: usar valor ingresado
          else if (cov.ProductElementCode === "HOUSEJEWERLYVALUES_COV") {
            sumInsured = formData.jewelry || 0;
          }
          // Piscina: usar 10% del valor de la propiedad si tiene piscina
          else if (cov.ProductElementCode === "HOUSESWIMPOOLTRAMPO_COV") {
            sumInsured = formData.thereIsSwimmingPool === "1" ? (formData.totalPrice || 0) * 0.1 : 0;
          }
          // Otras coberturas: usar 20% del valor de la propiedad como estimado
          else if (sumInsured === 0) {
            sumInsured = (formData.totalPrice || 0) * 0.2;
          }
          
          return { ...cov, selected: true, SumInsured: sumInsured };
        } else {
          return { ...cov, selected: false };
        }
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 5) {
      // Auto-complete algunos valores de cobertura al pasar al paso 4
      if (step === 3) {
        setAvailableCoverages(prev =>
          prev.map(cov => {
            // Auto-completar electrodomésticos con el valor ingresado
            if (cov.ProductElementCode === "HOUSEELECTROEQUIELECTRO_COV" && formData.electronicEquipment) {
              return { ...cov, SumInsured: formData.electronicEquipment, selected: true };
            }
            // Auto-completar joyas con el valor ingresado
            if (cov.ProductElementCode === "HOUSEJEWERLYVALUES_COV" && formData.jewelry) {
              return { ...cov, SumInsured: formData.jewelry, selected: true };
            }
            // Auto-completar piscina si tiene piscina
            if (cov.ProductElementCode === "HOUSESWIMPOOLTRAMPO_COV" && formData.thereIsSwimmingPool === "1") {
              return { ...cov, SumInsured: formData.totalPrice ? formData.totalPrice * 0.1 : 0, selected: true };
            }
            // Auto-completar valor de la propiedad en algunas coberturas
            if ((cov.ProductElementCode === "HOUSENATURPHENOM_COV" || cov.ProductElementCode === "HOUSEFIRE_COV") && formData.totalPrice) {
              return { ...cov, SumInsured: formData.totalPrice, selected: true };
            }
            return cov;
          })
        );
      }
      setStep(step + 1);
      return;
    }

    setLoading(true);
    
    // Obtener coberturas seleccionadas
    const selectedCoverages = availableCoverages.filter(cov => cov.selected);
    
    try {
      // Obtener datos del usuario
      const customerData = {
        name: "Test User",
        dateOfBirth: "1990-01-01T00:00:00",
        idType: "1",
        idNumber: "123456789",
        city: formData.district || "",
        state: formData.province || "",
        phone: "123456789",
        email: "test@example.com",
        zipCode: formData.postalCode || "",
        address: formData.address1 || "",
        gender: "M",
      };

      // Crear formData completo con las coberturas seleccionadas
      const completeFormData: HomeInsuranceFormData = {
        ...formData as HomeInsuranceFormData,
        selectedCoverages: selectedCoverages,
      };

      // Usar el nuevo proceso completo con confirmación y pago
      const response = await processHomeInsuranceApplication(
        completeFormData,
        customerData,
        handleCalculationConfirmation,
        handlePaymentConfirmation
      );

      if (response.success) {
        addNotification(`Policy issued successfully! Policy Number: ${response.policyNumber}`, "success");
        
        // Navegar a la página de recibo con los datos completos
        navigate("/home-insurance-receipt", {
          state: {
            policyNumber: response.policyNumber,
            proposalNo: response.proposalNo,
            totalPremium: response.totalPremium,
            issuedData: response.data,
            calculatedData: response.data, // Los datos calculados ya están incluidos en response.data
            formData: formData,
            customerData: customerData,
          }
        });
      } else {
        addNotification(response.error || "Error creating policy", "error");
      }
    } catch (error) {
      addNotification("Error creating home insurance policy", "error");
    } finally {
      setLoading(false);
    }
  };

  const homeTypes = [
    { value: "Singlefamilyhome", label: "Single Family Home" },
    { value: "Multifamilyhome", label: "Multi Family Home" },
    { value: "Villa", label: "Villa" },
    { value: "Chalet", label: "Chalet" },
    { value: "Apartment", label: "Apartment" },
    { value: "Mansion", label: "Mansion" },
  ];

  const constructionTypes = [
    { value: "Concrete", label: "Concrete" },
    { value: "Wood", label: "Wood" },
    { value: "Stone", label: "Stone" },
    { value: "ConcreteReinforced", label: "Concrete Reinforced" },
    { value: "Drywall", label: "Drywall" },
    { value: "Prefabricated", label: "Prefabricated" },
  ];

  const dwellingUses = [
    { value: "Housing", label: "Housing" },
    { value: "Rental", label: "Rental" },
    { value: "Storage", label: "Storage" },
    { value: "CommercialUse", label: "Commercial Use" },
    { value: "OtherUse", label: "Other Use" },
    { value: "ANursingHome", label: "Nursing Home" },
  ];

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="max-w-4xl w-full">
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-6">Home Insurance Application</h1>
            
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex justify-between mb-2 text-xs sm:text-sm">
                <span className={`${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>Property</span>
                <span className={`${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>Location</span>
                <span className={`${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>Security</span>
                <span className={`${step >= 4 ? 'text-primary' : 'text-gray-400'}`}>Coverage</span>
                <span className={`${step >= 5 ? 'text-primary' : 'text-gray-400'}`}>Review</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(step / 5) * 100}%` }}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Property Information */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Property Information</h2>
                  
                  <Select
                    label="Home Type"
                    placeholder="Select home type"
                    selectedKeys={formData.homeType ? [formData.homeType] : []}
                    onSelectionChange={(keys) => updateField('homeType', Array.from(keys)[0])}
                    isRequired
                  >
                    {homeTypes.map((type) => (
                      <SelectItem key={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Select
                    label="Construction Type"
                    placeholder="Select construction type"
                    selectedKeys={formData.constructionType ? [formData.constructionType] : []}
                    onSelectionChange={(keys) => updateField('constructionType', Array.from(keys)[0])}
                    isRequired
                  >
                    {constructionTypes.map((type) => (
                      <SelectItem key={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    label="Year of Construction"
                    type="date"
                    value={formData.yearConstruction || ""}
                    onValueChange={(value) => updateField('yearConstruction', value)}
                    isRequired
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Building Area (m²)"
                      type="number"
                      value={formData.buildingArea?.toString() || ""}
                      onValueChange={(value) => updateField('buildingArea', parseFloat(value))}
                      isRequired
                    />
                    <Input
                      label="Land Area (m²)"
                      type="number"
                      value={formData.landArea?.toString() || ""}
                      onValueChange={(value) => updateField('landArea', parseFloat(value))}
                      isRequired
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Number of Floors"
                      type="number"
                      value={formData.numberOfFloors?.toString() || ""}
                      onValueChange={(value) => updateField('numberOfFloors', parseInt(value))}
                      isRequired
                    />
                    <Input
                      label="Number of Rooms"
                      type="number"
                      value={formData.numberOfRooms?.toString() || ""}
                      onValueChange={(value) => updateField('numberOfRooms', parseInt(value))}
                      isRequired
                    />
                  </div>

                  <Input
                    label="Property Value (USD)"
                    type="number"
                    value={formData.totalPrice?.toString() || ""}
                    onValueChange={(value) => updateField('totalPrice', parseFloat(value))}
                    isRequired
                  />

                  <Input
                    label="Replacement Cost Estimate (USD)"
                    type="number"
                    value={formData.rce?.toString() || ""}
                    onValueChange={(value) => updateField('rce', parseFloat(value))}
                    isRequired
                  />

                  <Select
                    label="Dwelling Use"
                    placeholder="Select dwelling use"
                    selectedKeys={formData.dwellingUseTo ? [formData.dwellingUseTo] : []}
                    onSelectionChange={(keys) => updateField('dwellingUseTo', Array.from(keys)[0])}
                    isRequired
                  >
                    {dwellingUses.map((use) => (
                      <SelectItem key={use.value}>
                        {use.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    label="Number of Occupants"
                    type="number"
                    value={formData.howManyLiveProperty?.toString() || ""}
                    onValueChange={(value) => updateField('howManyLiveProperty', parseInt(value))}
                    isRequired
                  />
                </div>
              )}

              {/* Step 2: Location */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Property Location</h2>
                  
                  <Input
                    label="Address Line 1"
                    value={formData.address1 || ""}
                    onValueChange={(value) => updateField('address1', value)}
                    isRequired
                  />

                  <Input
                    label="Address Line 2 (Optional)"
                    value={formData.address2 || ""}
                    onValueChange={(value) => updateField('address2', value)}
                  />

                  <Input
                    label="Full Address"
                    value={formData.fullAddress || ""}
                    onValueChange={(value) => updateField('fullAddress', value)}
                    isRequired
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="District"
                      value={formData.district || ""}
                      onValueChange={(value) => updateField('district', value)}
                      isRequired
                    />
                    <Input
                      label="Province"
                      value={formData.province || ""}
                      onValueChange={(value) => updateField('province', value)}
                      isRequired
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Department"
                      value={formData.department || ""}
                      onValueChange={(value) => updateField('department', value)}
                      isRequired
                    />
                    <Input
                      label="Postal Code"
                      value={formData.postalCode || ""}
                      onValueChange={(value) => updateField('postalCode', value)}
                      isRequired
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Latitude (Optional)"
                      value={formData.latitude || ""}
                      onValueChange={(value) => updateField('latitude', value)}
                    />
                    <Input
                      label="Longitude (Optional)"
                      value={formData.longitude || ""}
                      onValueChange={(value) => updateField('longitude', value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Security & Features */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Security & Features</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Anti-theft Alarm"
                      selectedKeys={formData.antiTheftAlarm ? [formData.antiTheftAlarm] : []}
                      onSelectionChange={(keys) => updateField('antiTheftAlarm', Array.from(keys)[0])}
                    >
                      <SelectItem key="1">Yes</SelectItem>
                      <SelectItem key="0">No</SelectItem>
                    </Select>

                    <Select
                      label="Security Bars"
                      selectedKeys={formData.securityBars ? [formData.securityBars] : []}
                      onSelectionChange={(keys) => updateField('securityBars', Array.from(keys)[0])}
                    >
                      <SelectItem key="Y">Yes</SelectItem>
                      <SelectItem key="N">No</SelectItem>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Security Cameras"
                      selectedKeys={formData.securityCameras ? [formData.securityCameras] : []}
                      onSelectionChange={(keys) => updateField('securityCameras', Array.from(keys)[0])}
                    >
                      <SelectItem key="Y">Yes</SelectItem>
                      <SelectItem key="N">No</SelectItem>
                    </Select>

                    <Select
                      label="Fire Alarm"
                      selectedKeys={formData.haveFireAlarm ? [formData.haveFireAlarm] : []}
                      onSelectionChange={(keys) => updateField('haveFireAlarm', Array.from(keys)[0])}
                    >
                      <SelectItem key="1">Yes</SelectItem>
                      <SelectItem key="0">No</SelectItem>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Fire Extinguishers"
                      selectedKeys={formData.fireExtinguishers ? [formData.fireExtinguishers] : []}
                      onSelectionChange={(keys) => updateField('fireExtinguishers', Array.from(keys)[0])}
                    >
                      <SelectItem key="Y">Yes</SelectItem>
                      <SelectItem key="N">No</SelectItem>
                    </Select>

                    {formData.fireExtinguishers === "Y" && (
                      <Input
                        label="Number of Fire Extinguishers"
                        type="number"
                        value={formData.manyFireExtinguishers?.toString() || ""}
                        onValueChange={(value) => updateField('manyFireExtinguishers', parseInt(value))}
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Distance to Fire Hydrant (m)"
                      type="number"
                      value={formData.distanceFireHydrant?.toString() || ""}
                      onValueChange={(value) => updateField('distanceFireHydrant', parseFloat(value))}
                      isRequired
                    />
                    <Input
                      label="Distance to Fire Station (km)"
                      value={formData.distanceFireStation || ""}
                      onValueChange={(value) => updateField('distanceFireStation', value)}
                      isRequired
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Swimming Pool"
                      selectedKeys={formData.thereIsSwimmingPool ? [formData.thereIsSwimmingPool] : []}
                      onSelectionChange={(keys) => updateField('thereIsSwimmingPool', Array.from(keys)[0])}
                    >
                      <SelectItem key="1">Yes</SelectItem>
                      <SelectItem key="0">No</SelectItem>
                    </Select>

                    <Select
                      label="Property in Flood Zone"
                      selectedKeys={formData.propertyInFloodZone ? [formData.propertyInFloodZone] : []}
                      onSelectionChange={(keys) => updateField('propertyInFloodZone', Array.from(keys)[0])}
                    >
                      <SelectItem key="1">Yes</SelectItem>
                      <SelectItem key="0">No</SelectItem>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Electronic Equipment Value (USD)"
                      type="number"
                      value={formData.electronicEquipment?.toString() || ""}
                      onValueChange={(value) => updateField('electronicEquipment', parseFloat(value))}
                      isRequired
                    />
                    <Input
                      label="Jewelry Value (USD)"
                      type="number"
                      value={formData.jewelry?.toString() || ""}
                      onValueChange={(value) => updateField('jewelry', parseFloat(value))}
                      isRequired
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Coverage Selection */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Select Coverage Package</h2>
                  
                  {/* Pack Selection Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {Object.entries(coveragePacks).map(([key, pack]) => (
                      <Card 
                        key={key}
                        isPressable
                        onPress={() => handlePackSelection(key)}
                        className={`p-4 cursor-pointer transition-all ${
                          selectedPack === key 
                            ? 'ring-2 ring-primary bg-primary/10' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg">{pack.name}</h3>
                            {selectedPack === key && (
                              <span className="text-primary">✓</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{pack.description}</p>
                          {pack.coverages.length > 0 && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                              {pack.coverages.length} coberturas incluidas
                            </p>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Show selected pack details */}
                  {selectedPack !== "custom" && (
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                      <h3 className="font-semibold mb-2">📋 Coberturas del Pack {coveragePacks[selectedPack as keyof typeof coveragePacks].name}</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {availableCoverages
                          .filter(c => c.selected)
                          .map((coverage) => (
                            <li key={coverage.ProductElementCode} className="flex items-center gap-2">
                              <span className="text-primary">✓</span>
                              <span>{coverage.CoverageName}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {/* Individual Coverage Selection */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Coberturas {selectedPack === "custom" ? "" : "(Modificables)"}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedPack === "custom" 
                        ? "Selecciona las coberturas individuales que necesitas."
                        : "Puedes ajustar las coberturas o cambiar a personalizado si lo prefieres."}
                    </p>
                    
                    {availableCoverages.map((coverage) => (
                      <Card key={coverage.ProductElementCode} className="p-4">
                        <div className="flex flex-col space-y-3">
                          <div className="flex items-center justify-between">
                            <Checkbox
                              isSelected={coverage.selected}
                              onValueChange={() => handleCoverageToggle(coverage.ProductElementCode)}
                            >
                              <span className="font-semibold">{coverage.CoverageName}</span>
                            </Checkbox>
                          </div>
                          
                          {coverage.selected && (
                            <div className="ml-6">
                              <Input
                                label="Suma Asegurada (USD)"
                                type="number"
                                value={coverage.SumInsured.toString()}
                                onValueChange={(value) => handleCoverageSumInsured(coverage.ProductElementCode, parseFloat(value) || 0)}
                                min="0"
                                isRequired
                              />
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-4">
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      <strong>Coberturas Seleccionadas:</strong> {availableCoverages.filter(c => c.selected).length} de {availableCoverages.length}
                    </p>
                    {availableCoverages.filter(c => c.selected).length > 0 && (
                      <p className="text-sm text-blue-700 dark:text-blue-400 mt-2">
                        <strong>Valor Total de Cobertura:</strong> ${availableCoverages.filter(c => c.selected).reduce((sum, c) => sum + c.SumInsured, 0).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {step === 5 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Review Your Information</h2>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-2">
                    <p><strong>Home Type:</strong> {formData.homeType}</p>
                    <p><strong>Property Value:</strong> ${formData.totalPrice?.toLocaleString()}</p>
                    <p><strong>Building Area:</strong> {formData.buildingArea} m²</p>
                    <p><strong>Address:</strong> {formData.fullAddress}</p>
                    <p><strong>Security Features:</strong> {
                      [
                        formData.antiTheftAlarm === "1" && "Alarm",
                        formData.securityCameras === "Y" && "Cameras",
                        formData.haveFireAlarm === "1" && "Fire Alarm",
                      ].filter(Boolean).join(", ") || "None"
                    }</p>
                    <p><strong>Selected Coverages:</strong> {availableCoverages.filter(c => c.selected).length}</p>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Please review all information carefully before submitting. Once submitted, your application will be processed.
                  </p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-4">
                {step > 1 && (
                  <Button
                    variant="bordered"
                    onPress={() => setStep(step - 1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}
                
                <Button
                  color="primary"
                  type="submit"
                  isLoading={loading}
                  className="flex-1"
                >
                  {step < 5 ? "Next" : "Submit Application"}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Confirmation Modal - Detailed Information */}
        <Modal isOpen={isOpen} onClose={handleCancel} size="5xl" scrollBehavior="inside">
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              Resumen de Póliza - Confirme los Detalles
            </ModalHeader>
            <ModalBody className="max-h-[70vh] overflow-y-auto">
              {calculationData && (
                <div className="space-y-6">
                  {/* Proposal Number */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Número de Propuesta</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{calculationData.ProposalNo}</p>
                  </div>

                  {/* Dates Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">📅 Vigencia de la Póliza</h3>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Fecha de Inicio</p>
                        <p className="font-semibold">{new Date(calculationData.EffectiveDate).toLocaleDateString('es-ES')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Fecha de Vencimiento</p>
                        <p className="font-semibold">{new Date(calculationData.ExpiryDate).toLocaleDateString('es-ES')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Property Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">🏠 Información de la Propiedad</h3>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Dirección</p>
                        <p className="font-semibold">{formData.fullAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Tipo de Vivienda</p>
                        <p className="font-semibold">{formData.homeType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Valor de la Propiedad</p>
                        <p className="font-semibold">${formData.totalPrice?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Área de Construcción</p>
                        <p className="font-semibold">{formData.buildingArea} m²</p>
                      </div>
                    </div>
                  </div>

                  {/* Coverage Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">🛡️ Coberturas Seleccionadas</h3>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <ul className="space-y-2">
                        {availableCoverages.filter(c => c.selected).map((coverage) => (
                          <li key={coverage.ProductElementCode} className="flex items-start justify-between">
                            <div className="flex items-start">
                              <span className="text-green-500 mr-2">✓</span>
                              <span className="font-semibold">{coverage.CoverageName}</span>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              ${coverage.SumInsured.toLocaleString()}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Security Features */}
                  {(formData.antiTheftAlarm === "1" || formData.securityCameras === "Y" || 
                    formData.haveFireAlarm === "1" || formData.fireExtinguishers === "Y") && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">🔒 Características de Seguridad</h3>
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <ul className="grid grid-cols-2 gap-2">
                          {formData.antiTheftAlarm === "1" && (
                            <li className="flex items-center">
                              <span className="text-blue-500 mr-2">•</span>
                              <span>Alarma Anti-robo</span>
                            </li>
                          )}
                          {formData.securityCameras === "Y" && (
                            <li className="flex items-center">
                              <span className="text-blue-500 mr-2">•</span>
                              <span>Cámaras de Seguridad</span>
                            </li>
                          )}
                          {formData.haveFireAlarm === "1" && (
                            <li className="flex items-center">
                              <span className="text-blue-500 mr-2">•</span>
                              <span>Alarma contra Incendios</span>
                            </li>
                          )}
                          {formData.fireExtinguishers === "Y" && (
                            <li className="flex items-center">
                              <span className="text-blue-500 mr-2">•</span>
                              <span>Extintores ({formData.manyFireExtinguishers || 0})</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Important Notice */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      <strong>Importante:</strong> Por favor revise toda la información antes de continuar con el pago. 
                      Al hacer clic en "Continuar con el Pago", estará confirmando que todos los datos son correctos.
                    </p>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={handleCancel}>
                Cancelar
              </Button>
              <Button color="primary" onPress={handleConfirm}>
                Continuar con el Pago
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Payment Modal */}
        <Modal isOpen={isPaymentOpen} onClose={handlePaymentCancel} size="2xl" isDismissable={false}>
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              💳 Payment Information
            </ModalHeader>
            <ModalBody>
              {paymentData && (
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-2">
                      Order Summary
                    </h3>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <strong>Total Premium:</strong> ${paymentData.TotalPremium?.toFixed(2)}
                      </p>
                      <p className="text-sm">
                        <strong>Due Amount:</strong> ${paymentData.DuePremium?.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-md">Enter Card Details</h4>
                    
                    <Input
                      label="Cardholder Name"
                      placeholder="John Doe"
                      value={cardName}
                      onValueChange={setCardName}
                      isRequired
                    />

                    <Input
                      label="Card Number"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onValueChange={(value) => {
                        // Format card number with spaces
                        const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                        setCardNumber(formatted);
                      }}
                      maxLength={19}
                      isRequired
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Expiry Date"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onValueChange={(value) => {
                          // Format expiry date
                          const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
                          setCardExpiry(formatted);
                        }}
                        maxLength={5}
                        isRequired
                      />
                      <Input
                        label="CVV"
                        placeholder="123"
                        type="password"
                        value={cardCVV}
                        onValueChange={setCardCVV}
                        maxLength={4}
                        isRequired
                      />
                    </div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                    <p className="text-xs text-yellow-800 dark:text-yellow-400">
                      🔒 This is a simulated payment. No real transaction will be processed.
                    </p>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={handlePaymentCancel} isDisabled={isProcessingPayment}>
                Cancel
              </Button>
              <Button 
                color="primary" 
                onPress={handlePaymentConfirm}
                isLoading={isProcessingPayment}
              >
                {isProcessingPayment ? "Processing..." : "Pay Now"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </section>
    </DefaultLayout>
  );
}
