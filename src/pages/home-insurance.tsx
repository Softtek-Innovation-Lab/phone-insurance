import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createHomeInsurancePolicy } from "@/services/homeInsuranceService";
import type { HomeInsuranceFormData } from "@/types/homeInsurance";
import { useNotification } from "@/providers/NotificationProvider";

export default function HomeInsurancePage() {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
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
  });

  const updateField = (field: keyof HomeInsuranceFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    
    try {
      // Obtener datos del usuario (puedes mejorar esto con un contexto de usuario)
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

      const response = await createHomeInsurancePolicy(
        formData as HomeInsuranceFormData,
        customerData
      );

      if (response.success) {
        addNotification("Home insurance policy created successfully!", "success");
        navigate("/profile");
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
              <div className="flex justify-between mb-2">
                <span className={`text-sm ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>Property Info</span>
                <span className={`text-sm ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>Location</span>
                <span className={`text-sm ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>Security</span>
                <span className={`text-sm ${step >= 4 ? 'text-primary' : 'text-gray-400'}`}>Review</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(step / 4) * 100}%` }}
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

              {/* Step 4: Review */}
              {step === 4 && (
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
                  {step < 4 ? "Next" : "Submit Application"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </section>
    </DefaultLayout>
  );
}
