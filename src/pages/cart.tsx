// pages/CartPage.tsx
import { useGlobalStore } from "@/hooks/useGlobalStore";
import { useNotification } from "@/providers/NotificationProvider";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { Input } from "@heroui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { generatePolicy } from "@/store/slices/policySlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";

// Static content
const TEXT_CONTENT = {
  title: "Secure Your Products - Insurance Cart",
  emptyMessage: "Your cart is empty.",
  headers: ["Product", "Details", "Coverage", "Price", "Actions"],
  continueShopping: "Continue Shopping",
  clearCart: "Clear Shopping Cart",
  subtotal: "Subtotal",
  processingFee: "Processing Fee (USD)",
  orderTotal: "Order Total (USD)",
  riskFactor: "Risk Factor",
  proceedToCheckout: "Buy and Generate Receipt",
};

// Mock cart item (initial data)
const INITIAL_CART_ITEM = {
  id: "item1",
  name: "Phone Insurance",
  manufacturer: "Desconocido",
  model: "Desconocido",
  serialNumber: "Desconocido",
  state: "California",
  coverageAmount: "1000",
  deductible: "$75.00",
  policyTerm: "1 Year",
  paymentOption: "Annual One-Time",
  riskFactor: "medium",
  unitPrice: 154.00,
  premium: 100,
  quantity: 1,
  image: "https://img.freepik.com/free-vector/smartphone_53876-80286.jpg?t=st=1741271099~exp=1741274699~hmac=1d932fc53e6acc9908fdef6091f92a5ea881633c4af244a6df0b8f19d424ff23&w=740",
};

// Tipo para la respuesta de la póliza
interface PolicyResponse {
  PolicyNo?: string;
  PolicyStatus?: number;
  EffectiveDate?: string;
  ExpiryDate?: string;
  IssueDate?: string;
  GrossPremium?: number;
  Vat?: number;
  DuePremium?: number;
  VatRate?: number;
  PolicyCustomerList?: Array<{
    CustomerName?: string;
    DateOfBirth?: string;
    IdNo?: string;
  }>;
  IssueUserRealName?: string;
  OrgCode?: string;
  ProductCode?: string;
  ProductVersion?: string;
}

export default function CartPage() {
  const { store, setStore, clearStore } = useGlobalStore();
  const { addNotification } = useNotification();
  const [isGenerating, setIsGenerating] = useState(false);
  const [receiptGenerated, setReceiptGenerated] = useState(false);
  const [policyData, setPolicyData] = useState<PolicyResponse | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Mapea los datos del carrito y combina con datos iniciales para cualquier campo faltante
  const cart = store.cart?.map((item) => {
    // Creamos un nuevo objeto combinando los datos iniciales con los del producto real
    return {
      ...INITIAL_CART_ITEM,
      ...item,
      id: item.id || INITIAL_CART_ITEM.id,
      unitPrice: item.product?.PredefinedPremium || INITIAL_CART_ITEM.unitPrice,
      name: item.product?.name || INITIAL_CART_ITEM.name,
      image: item.product?.image || INITIAL_CART_ITEM.image,
      // Aseguramos que los valores del formulario se muestren correctamente
      manufacturer: item.manufacturer || INITIAL_CART_ITEM.manufacturer,
      model: item.model || INITIAL_CART_ITEM.model,
      serialNumber: item.serialNumber || INITIAL_CART_ITEM.serialNumber,
      // Otros datos
      quantity: item.quantity || 1,
      riskFactor: determineRiskFactor(item.state, item.manufacturer),
      premium: item.premium || INITIAL_CART_ITEM.premium,
    };
  }) || [];

  // Función para determinar el factor de riesgo basado en el estado y fabricante
  function determineRiskFactor(state: string, manufacturer: string): string {
    if (state === "California") {
      return manufacturer === "Apple" ? "low" : "medium";
    } else if (state === "New York") {
      return "high";
    } else if (state === "Texas") {
      return "medium-high";
    }
    return "medium";
  }

  // Formato de fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';

    // Si la fecha tiene formato de hora "T", la cortamos
    const datePart = dateString.split('T')[0];

    // Intentamos formatear la fecha
    try {
      const date = new Date(datePart);
      return date.toLocaleDateString();
    } catch (e) {
      return datePart;
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    setStore({ cart: updatedCart });
  };

  const removeItem = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setStore({ cart: updatedCart.length ? updatedCart : [] });
    addNotification("Producto eliminado del carrito", "info");
  };

  // Calcula el subtotal, tarifa de procesamiento y total del pedido
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const processingFee = subtotal > 0 ? 5.00 : 0;
  const orderTotal = subtotal + processingFee;

  // Función para generar el comprobante
  const generateReceipt = () => {
    setIsGenerating(true);

    console.log("Generando comprobante...", cart);
    generatePolicy(cart, dispatch)
      .then((response) => {
        console.log('Respuesta completa de la generación de póliza:', response);

        // Priorizar la respuesta de issue, luego bind, luego calculate
        const policyResponse = response?.issueResponse || response?.bindResponse || response?.calculateResponse;
        console.log('Datos de la póliza a mostrar:', policyResponse);

        setPolicyData(policyResponse);
        setReceiptGenerated(true);
        addNotification("¡Comprobante generado exitosamente!", "success");
      })
      .catch((error) => {
        addNotification("Error al generar el comprobante. Inténtalo nuevamente.", "error");
        console.error("Error generating receipt:", error);
      })
      .finally(() => {
        setIsGenerating(false);
      });
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="max-w-6xl w-full px-4">
          <h1 className="text-2xl font-bold mb-6">{TEXT_CONTENT.title}</h1>

          {/* Cart Header */}
          <div className="grid grid-cols-5 mb-4 bg-gray-800 p-3 rounded-t-md">
            {TEXT_CONTENT.headers.map((header, index) => (
              <div
                key={header + index}
                className={`text-white font-medium ${index === 0 ? "col-span-1" :
                  index === 1 ? "col-span-1" :
                    ""
                  }`}
              >
                {header}
              </div>
            ))}
          </div>

          {/* Cart Item */}
          {cart.length === 0 ? (
            <Card>
              <CardBody>
                <p className="text-default-500 text-center">{TEXT_CONTENT.emptyMessage}</p>
              </CardBody>
            </Card>
          ) : (
            <Card className="mb-4">
              <CardBody className="p-0">
                {cart.map((item, i) => (
                  <div key={item.id + i} className="grid grid-cols-5 items-center p-4 border-b last:border-b-0">
                    {/* Columna 1: Imagen */}
                    <div className="flex justify-center">
                      <Image
                        alt={item.name}
                        src={item.image}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </div>

                    {/* Columna 2: Nombre y modelo */}
                    <div>
                      <p className="font-medium text-lg">{item.name}</p>
                      <div className="text-sm text-default-600 mt-1">
                        <p><span className="font-semibold">Manufacturer:</span> {item.manufacturer}</p>
                        <p><span className="font-semibold">Model:</span> {item.model}</p>
                        <p><span className="font-semibold">Serial No.:</span> {item.serialNumber}</p>
                        <p><span className="font-semibold">State:</span> {item.state}</p>
                      </div>
                    </div>

                    {/* Column 3: Coverage, deductible, term, and risk factor */}
                    <div className="text-sm">
                      <p><span className="font-semibold">Coverage:</span> ${item.coverageAmount}</p>
                      <p><span className="font-semibold">Deductible:</span> {item.deductible}</p>
                      <p><span className="font-semibold">Term:</span> {item.policyTerm}</p>
                      <p>
                        <span className="font-semibold">Risk factor:</span>
                        <span className={`ml-1 font-medium ${getRiskColor(item.riskFactor)}`}>
                          {item.riskFactor}
                        </span>
                      </p>
                    </div>

                    {/* Columna 4: Precio */}
                    <div>
                      <p className="font-medium">${item.unitPrice.toFixed(2)}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-sm mr-2">Quantity:</span>
                        <Input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 h-8"
                          size="sm"
                        />
                      </div>
                      <p className="font-semibold mt-2">
                        Total: ${(item.unitPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Columna 5: Botón eliminar */}
                    <div className="flex justify-center">
                      <Button
                        isIconOnly
                        color="danger"
                        variant="light"
                        className="rounded-full"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={20} />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between mb-6">
            <Button variant="light" onPress={() => navigate("/")}>
              {TEXT_CONTENT.continueShopping}
            </Button>
            {cart.length > 0 && (
              <Button variant="light" color="danger" onPress={() => {
                clearStore();
                addNotification("El carrito ha sido vaciado", "info");
              }}>
                {TEXT_CONTENT.clearCart}
              </Button>
            )}
          </div>

          {/* Summary */}
          {cart.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Receipt (appears after clicking 'Generate') */}
              {receiptGenerated && (
                <Card className="bg-white border border-gray-200">
                  <CardBody className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-bold">Purchase Receipt</h3>
                      <p className="text-gray-500 text-sm">{new Date().toLocaleDateString()}</p>
                    </div>

                    {/* Policy Details */}
                    {policyData && (
                      <div className="bg-blue-50 p-4 rounded-md mb-4">
                        <h4 className="font-bold text-blue-800 mb-2">Policy Summary</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <p><span className="font-semibold">Policy Number:</span> {policyData.PolicyNo || 'N/A'}</p>
                            <p>
                              <span className="font-semibold">Holder:</span> {policyData.PolicyCustomerList?.[0]?.CustomerName || 'N/A'}
                              {policyData.PolicyCustomerList?.[0]?.DateOfBirth && ` (Birth: ${formatDate(policyData.PolicyCustomerList[0].DateOfBirth)})`}
                            </p>
                            <p><span className="font-semibold">Customer ID:</span> {policyData.PolicyCustomerList?.[0]?.IdNo || 'N/A'}</p>
                            <p><span className="font-semibold">Effective Date:</span> {formatDate(policyData.EffectiveDate)}</p>
                            <p><span className="font-semibold">Expiration Date:</span> {formatDate(policyData.ExpiryDate)}</p>
                          </div>
                          <div>
                            <p><span className="font-semibold">Gross Premium:</span> ${policyData.GrossPremium?.toFixed(2) || 'N/A'}</p>
                            <p><span className="font-semibold">VAT ({(policyData.VatRate || 0) * 100}%):</span> ${policyData.Vat?.toFixed(2) || 'N/A'}</p>
                            <p><span className="font-semibold">Total Premium:</span> ${policyData.DuePremium?.toFixed(2) || 'N/A'}</p>
                            <p><span className="font-semibold">Issue Date:</span> {formatDate(policyData.IssueDate)}</p>
                            <p><span className="font-semibold">Issuer:</span> {policyData.IssueUserRealName || 'N/A'}</p>
                            <p><span className="font-semibold">Product:</span> {policyData.ProductCode} (v{policyData.ProductVersion})</p>
                          </div>
                        </div>
                        <p className="mt-2 text-sm">
                          <span className="font-semibold">Status:</span> <span className="text-green-600 font-medium">
                            {policyData.PolicyStatus === 2 ? 'Active' : `Status ${policyData.PolicyStatus}`}
                          </span>
                        </p>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <h4 className="font-medium mb-2">Purchase Summary:</h4>
                      {cart.map((item, i) => (
                        <div key={`receipt-${item.id}-${i}`} className="flex justify-between mb-2 text-sm">
                          <span>{item.name} ({item.quantity}) - {item.manufacturer} {item.model}</span>
                          <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between mb-1">
                        <span>{TEXT_CONTENT.subtotal}</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>{TEXT_CONTENT.processingFee}</span>
                        <span>${processingFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                        <span>{TEXT_CONTENT.orderTotal}</span>
                        <span>${orderTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="mt-6 text-center">
                      <p className="text-green-600 font-medium">Thank you for your purchase!</p>
                      <p className="text-sm text-gray-500 mt-1">Your insurance is now active</p>
                    </div>
                  </CardBody>
                </Card>
              )}

              <Card className={`bg-gray-100 ${receiptGenerated ? 'lg:col-start-2' : 'lg:col-span-2'}`}>
                <CardBody className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span>{TEXT_CONTENT.subtotal}</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{TEXT_CONTENT.processingFee}</span>
                    <span>${processingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>{TEXT_CONTENT.orderTotal}</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                  <Button
                    color="primary"
                    size="lg"
                    className="mt-4"
                    isLoading={isGenerating}
                    isDisabled={isGenerating || receiptGenerated}
                    onClick={generateReceipt}
                  >
                    {isGenerating ? "Generating receipt..." : TEXT_CONTENT.proceedToCheckout}
                  </Button>
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      </section>
    </DefaultLayout>
  );
}

// Función auxiliar para determinar el color del factor de riesgo
function getRiskColor(riskFactor: 'low' | 'medium' | 'medium-high' | 'high'): string {
  switch (riskFactor) {
    case 'low':
      return 'text-green-600';
    case 'medium':
      return 'text-amber-600';
    case 'medium-high':
      return 'text-orange-600';
    case 'high':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}