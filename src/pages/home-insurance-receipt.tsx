import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface ReceiptData {
  policyNumber: string;
  proposalNo: string;
  totalPremium: number;
  issuedData: any;
  calculatedData: any;
  formData: any;
  customerData: any;
}

export default function HomeInsuranceReceiptPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  useEffect(() => {
    // Obtener los datos pasados desde la página anterior
    const data = location.state as ReceiptData;
    
    if (!data || !data.policyNumber) {
      // Si no hay datos, redirigir a la página principal
      navigate("/home-insurance");
      return;
    }
    
    setReceiptData(data);
  }, [location, navigate]);

  if (!receiptData) {
    return null;
  }

  const { policyNumber, proposalNo, totalPremium, issuedData, calculatedData, formData, customerData } = receiptData;

  const handlePrint = () => {
    window.print();
  };

  const handleGoToProfile = () => {
    navigate("/profile");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="max-w-4xl w-full">
          {/* Success Header */}
          <div className="text-center mb-6 space-y-3">
            <div className="flex justify-center">
              <CheckCircle2 className="h-20 w-20 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-green-600">¡Póliza Emitida Exitosamente!</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Tu seguro de hogar ha sido procesado correctamente
            </p>
          </div>

          {/* Receipt Card */}
          <Card className="p-8 print:shadow-none">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Recibo de Póliza de Seguro</h2>
              <p className="text-sm text-gray-500">Comprobante de Contratación</p>
            </div>

            <Divider className="my-6" />

            {/* Policy Number - Destacado */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg mb-6 border-2 border-blue-200 dark:border-blue-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Número de Póliza</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{policyNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Número de Propuesta</p>
                  <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">{proposalNo}</p>
                </div>
              </div>
            </div>

            {/* Policy Details */}
            <div className="space-y-6">
              {/* Dates Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                  📅 Vigencia de la Póliza
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Fecha de Inicio</p>
                      <p className="font-semibold">{formatDate(issuedData?.EffectiveDate || calculatedData?.EffectiveDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Fecha de Vencimiento</p>
                      <p className="font-semibold">{formatDate(issuedData?.ExpiryDate || calculatedData?.ExpiryDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Fecha de Emisión</p>
                      <p className="font-semibold">{formatDate(issuedData?.IssueDate || new Date().toISOString())}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Divider />

              {/* Premium Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                  💰 Detalles de la Prima
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Prima Bruta</span>
                      <span className="font-semibold">{formatCurrency(calculatedData?.GrossPremium)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Antes de IVA</span>
                      <span className="font-semibold">{formatCurrency(calculatedData?.BeforeVatPremium)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">IVA</span>
                      <span className="font-semibold">{formatCurrency(calculatedData?.Vat)}</span>
                    </div>
                    <Divider />
                    <div className="flex justify-between items-center bg-blue-100 dark:bg-blue-900/30 p-3 rounded-md">
                      <span className="text-lg font-bold">Prima Total</span>
                      <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                        {formatCurrency(totalPremium || calculatedData?.TotalPremium)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Prima Adeudada</span>
                      <span className="font-semibold">{formatCurrency(calculatedData?.DuePremium)}</span>
                    </div>
                    {calculatedData?.Commission && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Comisión</span>
                        <span className="font-semibold">{formatCurrency(calculatedData?.Commission)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Divider />

              {/* Property Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                  🏠 Información de la Propiedad
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Dirección</p>
                      <p className="font-semibold">{formData?.fullAddress}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Tipo de Vivienda</p>
                      <p className="font-semibold">{formData?.homeType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Área de Construcción</p>
                      <p className="font-semibold">{formData?.buildingArea} m²</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Área de Terreno</p>
                      <p className="font-semibold">{formData?.landArea} m²</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Valor de la Propiedad</p>
                      <p className="font-semibold">{formatCurrency(formData?.totalPrice)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Costo de Reemplazo Estimado</p>
                      <p className="font-semibold">{formatCurrency(formData?.rce)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Número de Pisos</p>
                      <p className="font-semibold">{formData?.numberOfFloors}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Número de Habitaciones</p>
                      <p className="font-semibold">{formData?.numberOfRooms}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Divider />

              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                  👤 Información del Asegurado
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Nombre</p>
                      <p className="font-semibold">{customerData?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                      <p className="font-semibold">{customerData?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Teléfono</p>
                      <p className="font-semibold">{customerData?.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Documento de Identidad</p>
                      <p className="font-semibold">{customerData?.idNumber}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Divider />

              {/* Coverage Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                  🛡️ Coberturas Incluidas
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <div>
                        <p className="font-semibold">Fenómenos Naturales</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Suma Asegurada: {formatCurrency(formData?.totalPrice)}
                        </p>
                      </div>
                    </li>
                    {formData?.electronicEquipment > 0 && (
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <div>
                          <p className="font-semibold">Equipos Electrónicos</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Suma Asegurada: {formatCurrency(formData?.electronicEquipment)}
                          </p>
                        </div>
                      </li>
                    )}
                    {formData?.jewelry > 0 && (
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <div>
                          <p className="font-semibold">Joyas y Objetos de Valor</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Suma Asegurada: {formatCurrency(formData?.jewelry)}
                          </p>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Security Features */}
              {(formData?.antiTheftAlarm === "1" || 
                formData?.securityCameras === "Y" || 
                formData?.haveFireAlarm === "1" ||
                formData?.fireExtinguishers === "Y") && (
                <>
                  <Divider />
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                      🔒 Características de Seguridad
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {formData?.antiTheftAlarm === "1" && (
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Alarma Anti-robo</span>
                          </li>
                        )}
                        {formData?.securityCameras === "Y" && (
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Cámaras de Seguridad</span>
                          </li>
                        )}
                        {formData?.haveFireAlarm === "1" && (
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Alarma contra Incendios</span>
                          </li>
                        )}
                        {formData?.fireExtinguishers === "Y" && (
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Extintores ({formData?.manyFireExtinguishers || 0})</span>
                          </li>
                        )}
                        {formData?.securityBars === "Y" && (
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Rejas de Seguridad</span>
                          </li>
                        )}
                        {formData?.doorsLocks === "Y" && (
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Cerraduras en Puertas</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>

            <Divider className="my-6" />

            {/* Important Notice */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
                📋 Información Importante
              </h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• Guarda este recibo para tus registros</li>
                <li>• Recibirás una copia por correo electrónico en las próximas 24 horas</li>
                <li>• Tu póliza será visible en tu perfil de usuario</li>
                <li>• Para cualquier consulta, contacta a nuestro servicio al cliente</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 mt-8 print:hidden">
              <Button
                color="primary"
                variant="bordered"
                onPress={handlePrint}
                className="flex-1"
              >
                🖨️ Imprimir Recibo
              </Button>
              <Button
                color="primary"
                onPress={handleGoToProfile}
                className="flex-1"
              >
                Ver Mis Pólizas
              </Button>
              <Button
                color="default"
                variant="light"
                onPress={handleGoHome}
                className="flex-1"
              >
                Volver al Inicio
              </Button>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-gray-500">
              <p>Este documento es un comprobante de contratación de seguro</p>
              <p>Generado el {new Date().toLocaleString("es-ES")}</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Print Styles */}
      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </DefaultLayout>
  );
}
