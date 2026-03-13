import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import travelersLogo from "@/assets/verified-shield.png";

interface ReceiptData {
  policyNumber: string;
  proposalNo: string;
  totalPremium: number;
  calculatedData: any;
  formData: any;
  customerData: any;
}

export default function HomeInsuranceReceiptPage() {
  const { t, i18n } = useTranslation();
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

  const { policyNumber, proposalNo, totalPremium, calculatedData } = receiptData;

  const handlePrint = () => {
    window.print();
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    
    // Configuración inicial
    doc.setFont("helvetica");
    
    const isEs = i18n.language === 'es';
    const isPt = i18n.language === 'pt';

    // Función auxiliar para cargar imagen
    const loadImage = (url: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
      });
    };

    try {
      // Banner azul en la parte superior
      doc.setFillColor(0, 82, 155); // Azul Travelers
      doc.rect(0, 0, 210, 40, "F");

      // Cargar y añadir logo
      const img = await loadImage(travelersLogo);
      // Ajustar tamaño del logo: supongamos width 20, height proporcional
      const imgWidth = 20;
      const imgHeight = (img.height * imgWidth) / img.width;
      doc.addImage(img, "PNG", 15, (40 - imgHeight) / 2, imgWidth, imgHeight);

      // Título en el banner
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255); // Blanco
      doc.text(t("homeInsuranceReceipt.pdfTitle", "Póliza de Seguro de Hogar"), 210 - 15, 25, { align: "right" });
    } catch (error) {
      console.error("Error loading logo image", error);
      // Fallback si no carga la imagen: solo el banner y título
      doc.setFillColor(0, 82, 155);
      doc.rect(0, 0, 210, 40, "F");
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text(t("homeInsuranceReceipt.pdfTitle", "Póliza de Seguro de Hogar"), 105, 25, { align: "center" });
    }
    
    // Estado
    doc.setFontSize(14);
    doc.setTextColor(40, 167, 69); // Verde
    doc.text(t("homeInsuranceReceipt.pdfStatus", "Emisión Confirmada"), 105, 55, { align: "center" });

    // Información General
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(t("homeInsuranceReceipt.policyDetailsTitle", "Detalles de la Póliza:"), 20, 70);
    
    const policyDetails = [
      [t("homeInsuranceReceipt.policyNumber", "Número de Póliza"), policyNumber || "N/A"],
      [t("homeInsuranceReceipt.proposalNumber", "Número de Propuesta"), proposalNo || "N/A"],
      [t("homeInsuranceReceipt.issueDate", "Fecha de Emisión"), new Date().toLocaleDateString(i18n.language)],
    ];

    autoTable(doc, {
      startY: 75,
      head: [[t("homeInsuranceReceipt.field", "Campo"), t("homeInsuranceReceipt.value", "Valor")]],
      body: policyDetails,
      theme: "grid",
      headStyles: { fillColor: [0, 82, 155] }, // Azul
    });

    // Información del Cliente
    const finalY1 = (doc as any).lastAutoTable.finalY || 75;
    doc.text(t("homeInsuranceReceipt.insuredDataTitle", "Datos del Asegurado:"), 20, finalY1 + 15);

    const customerDetails = [
      [t("homeInsuranceReceipt.fullName", "Nombre Completo"), receiptData?.customerData?.name || receiptData?.customerData?.FullName || "N/A"],
      [t("homeInsuranceReceipt.email", "Email"), receiptData?.customerData?.email || receiptData?.customerData?.Email || "N/A"],
      [t("homeInsuranceReceipt.idType", "Tipo de Identificación"), receiptData?.customerData?.idType || receiptData?.customerData?.IdType || "N/A"],
      [t("homeInsuranceReceipt.idNumber", "Número de Identificación"), receiptData?.customerData?.idNumber || receiptData?.customerData?.IdNo || "N/A"],
    ];

    autoTable(doc, {
      startY: finalY1 + 20,
      head: [[t("homeInsuranceReceipt.field", "Campo"), t("homeInsuranceReceipt.value", "Valor")]],
      body: customerDetails,
      theme: "grid",
      headStyles: { fillColor: [0, 82, 155] }, // Azul
    });

    // Coberturas Seleccionadas
    const finalY2 = (doc as any).lastAutoTable.finalY || finalY1 + 20;
    doc.text(t("homeInsuranceReceipt.selectedCoveragesTitle", "Coberturas Contratadas:"), 20, finalY2 + 15);

    const selectedCoveragesData = receiptData?.formData?.selectedCoverages || [];
    const coveragesTableBody = selectedCoveragesData.map((cov: any) => [
      cov.CoverageName || cov.ProductElementCode,
      formatCurrency(cov.SumInsured)
    ]);

    if (coveragesTableBody.length === 0) {
      coveragesTableBody.push([t("homeInsuranceReceipt.noCoverages", "Sin coberturas seleccionadas"), "-"]);
    }

    autoTable(doc, {
      startY: finalY2 + 20,
      head: [[t("homeInsuranceReceipt.coverageColumn", "Cobertura"), t("homeInsuranceReceipt.sumInsuredColumn", "Suma Asegurada")]],
      body: coveragesTableBody,
      theme: "grid",
      headStyles: { fillColor: [0, 82, 155] }, // Azul
    });

    // Resumen de Pago
    const finalY3 = (doc as any).lastAutoTable.finalY || finalY2 + 20;
    doc.text(t("homeInsuranceReceipt.paymentSummaryTitle", "Resumen de Pago:"), 20, finalY3 + 15);

    const paymentDetails = [
      [t("homeInsuranceReceipt.grossPremium", "Prima Bruta"), formatCurrency(calculatedData?.GrossPremium)],
      [t("homeInsuranceReceipt.beforeVat", "Antes de IVA"), formatCurrency(calculatedData?.BeforeVatPremium)],
      [t("homeInsuranceReceipt.vat", "IVA"), formatCurrency(calculatedData?.Vat)],
      [t("homeInsuranceReceipt.commission", "Comisión"), formatCurrency(calculatedData?.Commission)],
      [t("homeInsuranceReceipt.totalPremium", "Prima Total"), formatCurrency(totalPremium || calculatedData?.TotalPremium)],
      [t("homeInsuranceReceipt.duePremium", "Prima Adeudada"), formatCurrency(calculatedData?.DuePremium)],
    ];

    autoTable(doc, {
      startY: finalY3 + 20,
      head: [[t("homeInsuranceReceipt.concept", "Concepto"), t("homeInsuranceReceipt.amount", "Monto")]],
      body: paymentDetails,
      theme: "striped",
      headStyles: { fillColor: [0, 123, 255] },
    });

    // Footer
    const finalY4 = (doc as any).lastAutoTable.finalY || finalY3 + 20;
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(t("homeInsuranceReceipt.validDocumentNotice", "Este documento es un comprobante válido de la emisión de su póliza de seguro."), 105, finalY4 + 20, { align: "center" });
    doc.text(t("homeInsuranceReceipt.generatedOn", "Generado el {{date}}", { date: new Date().toLocaleString(i18n.language) }), 105, finalY4 + 26, { align: "center" });

    // Nueva página: Explicación de coberturas
    doc.addPage();
    
    // Header de la segunda página
    doc.setFillColor(0, 82, 155);
    doc.rect(0, 0, 210, 25, "F");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text(t("homeInsuranceReceipt.coverageDetailsTitle", "Detalle de Coberturas"), 105, 17, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(0, 82, 155);
    doc.text(t("homeInsuranceReceipt.howItWorks", "¿Cómo funcionan sus coberturas?"), 20, 40);

    const coveragesExplanation = [
      [
        t("homeInsurance.coverage.types.fireBuilding", "Incendio Edificio"),
        t("homeInsuranceReceipt.explanation.fireBuilding", "Protege la estructura de su hogar contra daños causados por fuego, rayo o explosión.")
      ],
      [
        t("homeInsurance.coverage.types.fireContent", "Incendio Contenido"),
        t("homeInsuranceReceipt.explanation.fireContent", "Cubre los bienes dentro de su hogar (muebles, ropa, electrodomésticos) en caso de incendio.")
      ],
      [
        t("homeInsurance.coverage.types.liability", "Responsabilidad Civil"),
        t("homeInsuranceReceipt.explanation.liability", "Cubre los daños materiales o lesiones que usted o su familia puedan causar a terceros.")
      ],
      [
        t("homeInsurance.coverage.types.homeCare", "Asistencia en el Hogar"),
        t("homeInsuranceReceipt.explanation.homeCare", "Servicios de emergencia para el hogar como plomería, electricidad, cerrajería y vidriería.")
      ],
      [
        t("homeInsurance.coverage.types.burglary", "Robo"),
        t("homeInsuranceReceipt.explanation.burglary", "Indemnización por la pérdida de sus bienes debido a robo o intento de robo en su domicilio.")
      ],
      [
        t("homeInsurance.coverage.types.flood", "Inundación"),
        t("homeInsuranceReceipt.explanation.flood", "Protección contra daños materiales directos causados por inundación o daños por agua.")
      ],
      [
        t("homeInsurance.coverage.types.crystalGlass", "Rotura de Cristales"),
        t("homeInsuranceReceipt.explanation.crystalGlass", "Cobertura para la rotura accidental de vidrios, cristales o espejos instalados en el hogar.")
      ],
      [
        t("homeInsurance.coverage.types.debrisRemoval", "Remoción de Escombros"),
        t("homeInsuranceReceipt.explanation.debrisRemoval", "Cubre los gastos para limpiar y remover escombros después de un siniestro cubierto.")
      ],
      [
        t("homeInsurance.coverage.types.tempAccommod", "Alojamiento Temporal"),
        t("homeInsuranceReceipt.explanation.tempAccommod", "Cubre gastos de hotel o alquiler si su hogar queda inhabitable tras un siniestro cubierto.")
      ],
      [
        t("homeInsurance.coverage.types.naturPhenom", "Fenómenos Naturales"),
        t("homeInsuranceReceipt.explanation.naturPhenom", "Protege su propiedad contra daños por huracanes, vendavales, granizo u otros fenómenos de la naturaleza.")
      ],
      [
        t("homeInsurance.coverage.types.electroEquip", "Equipos Electrónicos"),
        t("homeInsuranceReceipt.explanation.electroEquip", "Cobertura específica para daños o robo de equipos electrónicos y electrodomésticos.")
      ],
      [
        t("homeInsurance.coverage.types.jewelry", "Joyas y Valores"),
        t("homeInsuranceReceipt.explanation.jewelry", "Protección para joyas, relojes y otros objetos de alto valor especificados en la póliza.")
      ],
      [
        t("homeInsurance.coverage.types.swimPool", "Piscina y Trampolín"),
        t("homeInsuranceReceipt.explanation.swimPool", "Cobertura de responsabilidad civil extendida y daños materiales para instalaciones recreativas.")
      ]
    ];

    autoTable(doc, {
      startY: 50,
      head: [[t("homeInsuranceReceipt.coverageColumn", "Cobertura"), t("homeInsuranceReceipt.descriptionColumn", "Descripción")]],
      body: coveragesExplanation,
      theme: "striped",
      headStyles: { fillColor: [0, 82, 155] },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { cellWidth: 'auto' }
      },
      styles: { fontSize: 10 }
    });

    const finalY5 = (doc as any).lastAutoTable.finalY || 50;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(t("homeInsuranceReceipt.coverageFooter", "* Solo aplican las coberturas que han sido contratadas e indicadas en la primera página."), 20, finalY5 + 15);

    // Descargar el PDF
    const filenamePrefix = isEs ? "Poliza_Hogar" : isPt ? "Apolice_Residencial" : "Home_Policy";
    doc.save(`${filenamePrefix}_${policyNumber || "New"}.pdf`);
  };

  const handleGoToProfile = () => {
    navigate("/profile");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(i18n.language === 'es' ? 'es-PE' : i18n.language === 'pt' ? 'pt-BR' : 'en-US', {
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
            <h1 className="text-3xl font-bold text-green-600">{t("homeInsuranceReceipt.successTitle", "¡Pago Procesado Exitosamente!")}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("homeInsuranceReceipt.successSubtitle", "Tu póliza ha sido emitida correctamente")}
            </p>
          </div>

          {/* Receipt Card */}
          <Card className="p-8 print:shadow-none">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">{t("homeInsuranceReceipt.receiptTitle", "Comprobante de Pago")}</h2>
              <p className="text-sm text-gray-500">{t("homeInsuranceReceipt.insuranceType", "Seguro de Hogar")}</p>
            </div>

            <Divider className="my-6" />

            {/* Policy Number - Destacado */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg mb-6 border-2 border-green-200 dark:border-green-800">
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">{t("homeInsuranceReceipt.policyNumber", "Número de Póliza")}</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-400">{policyNumber}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t("homeInsuranceReceipt.proposalNumber", "Número de Propuesta")}: {proposalNo}</p>
              </div>
            </div>

            {/* Payment Details - Main Focus */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">
                  💰 {t("homeInsuranceReceipt.paymentSummaryTitle", "Resumen de Pago")}
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-600 dark:text-gray-400">{t("homeInsuranceReceipt.grossPremium", "Prima Bruta")}</span>
                      <span className="font-semibold">{formatCurrency(calculatedData?.GrossPremium)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-600 dark:text-gray-400">{t("homeInsuranceReceipt.beforeVat", "Antes de IVA")}</span>
                      <span className="font-semibold">{formatCurrency(calculatedData?.BeforeVatPremium)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-600 dark:text-gray-400">{t("homeInsuranceReceipt.vat", "IVA")}</span>
                      <span className="font-semibold">{formatCurrency(calculatedData?.Vat)}</span>
                    </div>
                    <Divider className="my-2" />
                    <div className="flex justify-between items-center bg-blue-100 dark:bg-blue-900/30 p-4 rounded-md">
                      <span className="text-xl font-bold">{t("homeInsuranceReceipt.totalPremium", "Prima Total")}</span>
                      <span className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                        {formatCurrency(totalPremium || calculatedData?.TotalPremium)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-600 dark:text-gray-400">{t("homeInsuranceReceipt.duePremium", "Prima Adeudada")}</span>
                      <span className="font-semibold">{formatCurrency(calculatedData?.DuePremium)}</span>
                    </div>
                    {calculatedData?.Commission && (
                      <div className="flex justify-between items-center text-lg">
                        <span className="text-gray-600 dark:text-gray-400">{t("homeInsuranceReceipt.commission", "Comisión")}</span>
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
                    {t("homeInsuranceReceipt.paymentConfirmed", "Pago Confirmado")}
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {t("homeInsuranceReceipt.paymentConfirmedDesc", "Tu pago ha sido procesado exitosamente. La póliza está activa y la cobertura ha comenzado.")}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                    <strong>{t("homeInsuranceReceipt.processingDate", "Fecha de procesamiento")}:</strong> {new Date().toLocaleString(i18n.language)}
                  </p>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
                📋 {t("homeInsuranceReceipt.nextSteps", "Próximos Pasos")}
              </h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• {t("homeInsuranceReceipt.nextStep1", "Recibirás una copia de tu póliza por correo electrónico en las próximas 24 horas")}</li>
                <li>• {t("homeInsuranceReceipt.nextStep2", "Puedes consultar los detalles completos de tu póliza en tu perfil")}</li>
                <li>• {t("homeInsuranceReceipt.nextStep3", "Guarda este comprobante para tus registros")}</li>
                <li>• {t("homeInsuranceReceipt.nextStep4", "Para cualquier consulta, contacta a nuestro servicio al cliente")}</li>
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
                🖨️ {t("homeInsuranceReceipt.printReceipt", "Imprimir Comprobante")}
              </Button>
              <Button
                color="primary"
                variant="bordered"
                onPress={generatePDF}
                className="flex-1"
              >
                📝 {t("homeInsuranceReceipt.downloadPDF", "Descargar Póliza PDF")}
              </Button>
              <Button
                color="primary"
                onPress={handleGoToProfile}
                className="flex-1"
              >
                {t("homeInsuranceReceipt.viewPolicyDetails", "Ver Detalles de la Póliza")}
              </Button>
              <Button
                color="default"
                variant="bordered"
                onPress={handleGoHome}
                className="flex-1"
              >
                {t("homeInsuranceReceipt.goHome", "Volver al Inicio")}
              </Button>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-gray-500">
              <p>{t("homeInsuranceReceipt.receiptFooterTitle", "Comprobante de pago - Seguro de Hogar")}</p>
              <p>{t("homeInsuranceReceipt.policyNo", "Póliza No")}: {policyNumber}</p>
              <p>{t("homeInsuranceReceipt.generatedOn", "Generado el {{date}}", { date: new Date().toLocaleString(i18n.language) })}</p>
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
