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

  const { policyNumber, proposalNo, totalPremium, issuedData, calculatedData } = receiptData;

  const handlePrint = () => {
    window.print();
  };

  const handleGoToProfile = () => {
    navigate("/profile");
  };

  const handleGoHome = () => {
    navigate("/");
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
            <h1 className="text-3xl font-bold text-green-600">¡Pago Procesado Exitosamente!</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Tu póliza ha sido emitida correctamente
            </p>
          </div>

          {/* Receipt Card */}
          <Card className="p-8 print:shadow-none">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Comprobante de Pago</h2>
              <p className="text-sm text-gray-500">Seguro de Hogar</p>
            </div>

            <Divider className="my-6" />

            {/* Policy Number - Destacado */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg mb-6 border-2 border-green-200 dark:border-green-800">
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Número de Póliza</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-400">{policyNumber}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Número de Propuesta: {proposalNo}</p>
              </div>
            </div>

            {/* Payment Details - Main Focus */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">
                  💰 Resumen de Pago
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-600 dark:text-gray-400">Prima Bruta</span>
                      <span className="font-semibold">{formatCurrency(calculatedData?.GrossPremium)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-600 dark:text-gray-400">Antes de IVA</span>
                      <span className="font-semibold">{formatCurrency(calculatedData?.BeforeVatPremium)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-600 dark:text-gray-400">IVA</span>
                      <span className="font-semibold">{formatCurrency(calculatedData?.Vat)}</span>
                    </div>
                    <Divider className="my-2" />
                    <div className="flex justify-between items-center bg-blue-100 dark:bg-blue-900/30 p-4 rounded-md">
                      <span className="text-xl font-bold">Prima Total</span>
                      <span className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                        {formatCurrency(totalPremium || calculatedData?.TotalPremium)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-600 dark:text-gray-400">Prima Adeudada</span>
                      <span className="font-semibold">{formatCurrency(calculatedData?.DuePremium)}</span>
                    </div>
                    {calculatedData?.Commission && (
                      <div className="flex justify-between items-center text-lg">
                        <span className="text-gray-600 dark:text-gray-400">Comisión</span>
                        <span className="font-semibold">{formatCurrency(calculatedData?.Commission)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Divider className="my-8" />

            {/* Payment Confirmation */}
            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded mb-6">
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-800 dark:text-green-400 mb-1">
                    Pago Confirmado
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Tu pago ha sido procesado exitosamente. La póliza está activa y la cobertura ha comenzado.
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                    <strong>Fecha de procesamiento:</strong> {new Date().toLocaleString("es-ES")}
                  </p>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
                📋 Próximos Pasos
              </h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• Recibirás una copia de tu póliza por correo electrónico en las próximas 24 horas</li>
                <li>• Puedes consultar los detalles completos de tu póliza en tu perfil</li>
                <li>• Guarda este comprobante para tus registros</li>
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
                🖨️ Imprimir Comprobante
              </Button>
              <Button
                color="primary"
                onPress={handleGoToProfile}
                className="flex-1"
              >
                Ver Detalles de la Póliza
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
              <p>Comprobante de pago - Seguro de Hogar</p>
              <p>Póliza No: {policyNumber}</p>
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
