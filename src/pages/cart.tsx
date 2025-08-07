// pages/CartPage.tsx
import { useGlobalStore } from "@/hooks/useGlobalStore";
import { useNotification } from "@/providers/NotificationProvider";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { Input } from "@heroui/input";
import { Divider } from "@heroui/divider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Trash2, ShoppingCart, Shield, CreditCard, MapPin, Phone, Mail, User, Package } from "lucide-react";
import { generatePolicy } from "@/store/slices/policySlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { useAuth } from "@/auth/AuthProvider";
import { faker } from '@faker-js/faker';
import { useTranslation } from 'react-i18next';

// Static content removed - not needed with the new multi-step design

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

// Customer information interface
interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function CartPage() {
  const { t } = useTranslation();
  const { store, setStore, clearStore } = useGlobalStore();
  const { addNotification } = useNotification();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [policyData, setPolicyData] = useState<PolicyResponse | null>(null);
  const [currentStep, setCurrentStep] = useState<'cart' | 'checkout' | 'confirmation'>('cart');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    country: user?.country || 'United States'
  });

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Mapea los datos del carrito y combina con datos iniciales para cualquier campo faltante
  const cart = store.cart?.map((item, index) => {
    console.log(`🔍 Processing cart item ${index}:`, item);
    console.log(`🆔 Item ID:`, item.id);
    console.log(`📦 Item product:`, item.product);

    // ⚠️ MIGRACIÓN: Si el item no tiene ID (items agregados antes del fix), generamos uno único
    const itemId = item.id || `migrated-item-${index}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    if (!item.id) {
      console.log(`🔧 MIGRATING item ${index} - Generated new ID:`, itemId);
    }

    // Creamos un nuevo objeto combinando los datos iniciales con los del producto real
    const mappedItem = {
      ...INITIAL_CART_ITEM,
      ...item,
      // Usar el ID único (ya existente o recién generado para migración)
      id: itemId,
      unitPrice: item.product?.PredefinedPremium ?? INITIAL_CART_ITEM.unitPrice,
      name: item.product?.name ?? INITIAL_CART_ITEM.name,
      image: item.product?.image ?? INITIAL_CART_ITEM.image,
      // Aseguramos que los valores del formulario se muestren correctamente
      manufacturer: item.manufacturer ?? INITIAL_CART_ITEM.manufacturer,
      model: item.model ?? INITIAL_CART_ITEM.model,
      serialNumber: item.serialNumber ?? INITIAL_CART_ITEM.serialNumber,
      // Otros datos
      quantity: item.quantity ?? 1,
      riskFactor: determineRiskFactor(item.state ?? INITIAL_CART_ITEM.state, item.manufacturer ?? INITIAL_CART_ITEM.manufacturer),
      premium: item.premium ?? INITIAL_CART_ITEM.premium,
    };

    console.log(`✅ Mapped item ${index} with ID:`, mappedItem.id);
    return mappedItem;
  }) ?? [];

  console.log("🛒 Current cart after mapping:", cart);
  console.log("📋 Original store.cart:", store.cart);
  console.log("🔢 Cart IDs:", cart.map(item => item.id));

  // 🔧 MIGRACIÓN: Actualizamos el store si algún item fue migrado (no tenía ID)
  const hasItemsWithoutId = store.cart?.some(item => !item.id) ?? false;
  if (hasItemsWithoutId && cart.length > 0) {
    console.log("🔄 Updating store with migrated IDs...");
    const migratedStoreCart = cart.map(item => ({
      ...store.cart?.find((_, index) => index === cart.findIndex(c => c.id === item.id)) || {},
      id: item.id // Ensure the store cart has the migrated IDs
    }));
    setStore({ cart: migratedStoreCart });
  }

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

  const updateQuantity = (id: string, quantity: number) => {
    console.log("🔄 === UPDATE QUANTITY START ===");
    console.log("🎯 Target ID:", id);
    console.log("📊 New quantity:", quantity);
    console.log("🛒 Current store.cart before update:", store.cart);
    console.log("🆔 All current IDs in store.cart:", store.cart?.map(item => `"${item.id}"`));

    const updatedCart = store.cart?.map((item, index) => {
      console.log(`🔍 Checking item ${index}:`);
      console.log(`   - Item ID: "${item.id}"`);
      console.log(`   - Target ID: "${id}"`);
      console.log(`   - Match: ${item.id === id}`);
      console.log(`   - Current quantity: ${item.quantity}`);

      if (item.id === id) {
        console.log(`✅ FOUND MATCH! Updating item ${index} from quantity ${item.quantity} to ${Math.max(1, quantity)}`);
        return { ...item, quantity: Math.max(1, quantity) };
      } else {
        console.log(`❌ NO MATCH for item ${index}, keeping original`);
        return item;
      }
    }) || [];

    console.log("🛒 Updated cart result:", updatedCart);
    console.log("🆔 Updated cart IDs:", updatedCart.map(item => `"${item.id}"`));
    console.log("📊 Updated cart quantities:", updatedCart.map(item => item.quantity));
    setStore({ cart: updatedCart });
    console.log("🔄 === UPDATE QUANTITY END ===");
  };

  const removeItem = (id: string) => {
    console.log("🗑️ === REMOVE ITEM START ===");
    console.log("🎯 Target ID to remove:", id);
    console.log("🛒 Current store.cart before removal:", store.cart);
    console.log("🆔 All current IDs in store.cart:", store.cart?.map(item => `"${item.id}"`));

    const updatedCart = store.cart?.filter((item, index) => {
      console.log(`🔍 Checking item ${index} for removal:`);
      console.log(`   - Item ID: "${item.id}"`);
      console.log(`   - Target ID: "${id}"`);
      console.log(`   - Should keep (ID !== target): ${item.id !== id}`);
      return item.id !== id;
    }) || [];

    console.log("🛒 Updated cart after filter:", updatedCart);
    console.log("🆔 Remaining IDs after removal:", updatedCart.map(item => `"${item.id}"`));
    setStore({ cart: updatedCart });
    addNotification(t('notification.productRemoved'), "info");
    console.log("🗑️ === REMOVE ITEM END ===");
  };

  // Calcula el subtotal, tarifa de procesamiento y total del pedido
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const processingFee = subtotal > 0 ? 5.00 : 0;
  const orderTotal = subtotal + processingFee;

  // Función para generar el comprobante
  const generateReceipt = () => {
    setIsGenerating(true);

    // Generate fake customer data if not provided
    if (!customerInfo.firstName || !customerInfo.lastName) {
      const fakeCustomer = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: 'United States'
      };
      setCustomerInfo(fakeCustomer);
    }

    console.log("Generating receipt...", cart);
    generatePolicy(cart, dispatch)
      .then((response) => {
        console.log('Complete policy generation response:', response);

        const policyResponse = (response?.issueResponse ?? response?.bindResponse) ?? response?.calculateResponse;
        console.log('Policy data to display:', policyResponse);

        if (policyResponse && policyResponse.PolicyNo) {
          // Guardar la póliza en localStorage
          const purchasedPolicies = JSON.parse(localStorage.getItem('purchasedPolicies') || '[]');
          purchasedPolicies.push({
            policyNo: policyResponse.PolicyNo,
            date: policyResponse.EffectiveDate || new Date().toISOString(),
          });
          localStorage.setItem('purchasedPolicies', JSON.stringify(purchasedPolicies));
        }

        setPolicyData(policyResponse);
        setCurrentStep('confirmation');
        addNotification(t('notification.receiptGenerated'), "success");
      })
      .catch((error) => {
        addNotification(t('notification.errorGeneratingReceipt'), "error");
        console.error("Error generating receipt:", error);
      })
      .finally(() => {
        setIsGenerating(false);
      });
  };

  // Helper functions for the improved cart
  const renderCartStep = () => {
    if (cart.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-2">{t('cart.emptyCartTitle')}</h2>
          <p className="text-gray-600 mb-6">{t('cart.emptyCartMessage')}</p>
          <Button color="primary" onPress={() => navigate("/")}>
            {t('cart.browseProducts')}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Cart Items */}
        <div className="space-y-4">
          {cart.map((item) => (
            <Card key={item.id} className="animate-fade-in shadow-sm hover:shadow-md transition-shadow bg-slate-50 border border-slate-200">
              <CardBody className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Product Image & Info */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-gray-600">{item.manufacturer} - {item.model}</p>
                      <div className="flex items-center mt-2">
                        <Shield className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">{t('cart.coverage')}: ${item.coverageAmount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="font-medium">{t('cart.serial')}:</span>
                        <p className="text-gray-600">{item.serialNumber}</p>
                      </div>
                      <div>
                        <span className="font-medium">{t('cart.state')}:</span>
                        <p className="text-gray-600">{item.state}</p>
                      </div>
                      <div>
                        <span className="font-medium">{t('cart.term')}:</span>
                        <p className="text-gray-600">{item.policyTerm}</p>
                      </div>
                      <div>
                        <span className="font-medium">{t('cart.deductible')}:</span>
                        <p className="text-gray-600">{item.deductible}</p>
                      </div>
                    </div>
                  </div>

                  {/* Risk & Price */}
                  <div className="text-center">
                    <div className="mb-2">
                      <span className="text-sm font-medium">{t('cart.riskFactor')}:</span>
                      <div className={`inline-block ml-2 px-2 py-1 rounded-full text-xs font-medium ${item.riskFactor === 'low' ? 'bg-green-100 text-green-800' :
                        item.riskFactor === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          item.riskFactor === 'medium-high' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {item.riskFactor}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-primary">${item.unitPrice.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">{t('cart.perYear')}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="bordered"
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                        isDisabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="bordered"
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        isDisabled={item.quantity >= 10}
                      >
                        +
                      </Button>
                    </div>
                    <Button
                      color="danger"
                      variant="light"
                      size="sm"
                      onPress={() => removeItem(item.id)}
                      startContent={<Trash2 size={16} />}
                    >
                      {t('cart.remove')}
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Cart Actions */}
        <div className="flex justify-between items-center py-4">
          <Button variant="light" onPress={() => navigate("/")}>
            {t('cart.continueShopping')}
          </Button>
          <div className="flex space-x-4">
            <Button
              variant="light"
              color="danger"
              onPress={() => {
                clearStore();
                addNotification(t('notification.cartCleared'), "info");
              }}
            >
              {t('cart.clearCart')}
            </Button>
            <Button
              color="primary"
              size="lg"
              onPress={() => setCurrentStep('checkout')}
            >
              {t('cart.proceedToCheckout')} (${orderTotal.toFixed(2)})
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderCheckoutStep = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Information Form */}
        <Card>
          <CardBody className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <User className="mr-2" />
              {t('checkout.customerInformation')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('checkout.firstName')}
                value={customerInfo.firstName}
                onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                required
              />
              <Input
                label={t('checkout.lastName')}
                value={customerInfo.lastName}
                onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                required
              />
              <Input
                label={t('checkout.email')}
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                startContent={<Mail size={18} />}
                required
              />
              <Input
                label={t('checkout.phone')}
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                startContent={<Phone size={18} />}
                required
              />
              <Input
                label={t('checkout.address')}
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                startContent={<MapPin size={18} />}
                className="md:col-span-2"
                required
              />
              <Input
                label={t('checkout.city')}
                value={customerInfo.city}
                onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                required
              />
              <Input
                label={t('checkout.state')}
                value={customerInfo.state}
                onChange={(e) => setCustomerInfo({ ...customerInfo, state: e.target.value })}
                required
              />
              <Input
                label={t('checkout.zipCode')}
                value={customerInfo.zipCode}
                onChange={(e) => setCustomerInfo({ ...customerInfo, zipCode: e.target.value })}
                required
              />
              <Input
                label={t('checkout.country')}
                value={customerInfo.country}
                onChange={(e) => setCustomerInfo({ ...customerInfo, country: e.target.value })}
                required
              />
            </div>
          </CardBody>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardBody className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Package className="mr-2" />
              {t('checkout.orderSummary')}
            </h3>

            <div className="space-y-4">
              {cart.map((item) => (
                <div key={`checkout-${item.id}`} className="flex justify-between items-center py-2 border-b">
                  <div className="flex items-center space-x-3">
                    <Image src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex justify-between">
                <span>{t('checkout.subtotal')}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('checkout.processingFee')}</span>
                <span>${processingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>{t('checkout.total')}</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                color="primary"
                size="lg"
                className="w-full"
                onPress={generateReceipt}
                isLoading={isGenerating}
                startContent={!isGenerating && <CreditCard size={18} />}
              >
                {isGenerating ? t('checkout.processing') : t('checkout.completePurchase')}
              </Button>
              <Button
                variant="light"
                className="w-full"
                onPress={() => setCurrentStep('cart')}
              >
                {t('checkout.backToCart')}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  };

  const renderConfirmationStep = () => {
    // Generate additional fake data for comprehensive receipt
    const currentDate = new Date().toLocaleDateString('en-US');
    const birthDate = faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toLocaleDateString('en-US');
    const customerId = faker.string.numeric(9);
    const issuer = "martin.gimenezartero@softtek.com";
    const productCode = "TRAV_PROP_MKT";
    const productVersion = "v1.0";
    const vatRate = 18;
    const grossPremium = subtotal;
    const vat = grossPremium * (vatRate / 100);
    const totalPremium = grossPremium + vat;

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="text-6xl text-green-500 mb-4">✅</div>
          <h2 className="text-3xl font-bold text-green-600">{t('confirmation.thankYou')}</h2>
          <p className="text-lg text-gray-600">{t('confirmation.insuranceActive')}</p>
        </div>

        {/* Complete Receipt */}
        <Card className="print:shadow-none">
          <CardBody className="p-8">
            {/* Receipt Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">{t('confirmation.receiptTitle')}</h1>
              <p className="text-gray-600">{currentDate}</p>
            </div>

            {/* Policy Summary */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-primary">{t('confirmation.policySummary')}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">{t('confirmation.policyNumber')}:</span>
                    <p className="text-gray-800">{policyData?.PolicyNo ?? `POTRAV_PROP_MKT${faker.string.numeric(8)}`}</p>
                  </div>
                  <div>
                    <span className="font-medium">{t('confirmation.holder')}:</span>
                    <p className="text-gray-800">{customerInfo.firstName} {customerInfo.lastName} ({t('confirmation.birthDate')}: {birthDate})</p>
                  </div>
                  <div>
                    <span className="font-medium">{t('confirmation.customerId')}:</span>
                    <p className="text-gray-800">{customerId}</p>
                  </div>
                  <div>
                    <span className="font-medium">{t('confirmation.effectiveDate')}:</span>
                    <p className="text-gray-800">{policyData?.EffectiveDate ?? new Date().toLocaleDateString('en-US')}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">{t('confirmation.expirationDate')}:</span>
                    <p className="text-gray-800">{policyData?.ExpiryDate ?? new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('en-US')}</p>
                  </div>
                  <div>
                    <span className="font-medium">{t('confirmation.grossPremium')}:</span>
                    <p className="text-gray-800">${grossPremium.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="font-medium">{t('confirmation.vatRate')} ({vatRate}%):</span>
                    <p className="text-gray-800">${vat.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="font-medium">{t('confirmation.totalPremium')}:</span>
                    <p className="text-gray-800 font-bold text-lg">${totalPremium.toFixed(2)}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">{t('confirmation.issueDate')}:</span>
                    <p className="text-gray-800">{new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString('en-US')}</p>
                  </div>
                  <div>
                    <span className="font-medium">{t('confirmation.issuer')}:</span>
                    <p className="text-gray-800">{issuer}</p>
                  </div>
                  <div>
                    <span className="font-medium">{t('confirmation.product')}:</span>
                    <p className="text-gray-800">{productCode} ({productVersion})</p>
                  </div>
                  <div>
                    <span className="font-medium">{t('confirmation.status')}:</span>
                    <p className="text-green-600 font-medium">{t('confirmation.active')}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div>
                  <span className="font-medium">{t('confirmation.contact')}:</span>
                  <p className="text-gray-800">{customerInfo.email}</p>
                </div>
              </div>
            </div>

            <Divider className="my-6" />

            {/* Purchase Summary */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-primary">{t('confirmation.purchaseSummary')}:</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={`receipt-${item.id}`} className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{item.name} ({item.quantity})</h3>
                        <p className="text-sm text-gray-600">{item.manufacturer} {item.model}</p>
                        <div className="flex items-center mt-1">
                          <Shield className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-sm text-green-600">{t('confirmation.coverage')}: ${item.coverageAmount}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">${item.unitPrice.toFixed(2)} {t('confirmation.each')}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-lg">
                  <span>{t('confirmation.subtotal')}</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('confirmation.processingFee')} ({t('confirmation.usd')})</span>
                  <span>${processingFee.toFixed(2)}</span>
                </div>
                <Divider />
                <div className="flex justify-between text-xl font-bold text-primary">
                  <span>{t('confirmation.orderTotal')} ({t('confirmation.usd')})</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">{t('confirmation.customerInformation')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>{t('confirmation.name')}:</strong> {customerInfo.firstName} {customerInfo.lastName}</p>
                  <p><strong>{t('confirmation.email')}:</strong> {customerInfo.email}</p>
                  <p><strong>{t('confirmation.phone')}:</strong> {customerInfo.phone}</p>
                </div>
                <div>
                  <p><strong>{t('confirmation.address')}:</strong> {customerInfo.address}</p>
                  <p><strong>{t('confirmation.city')}:</strong> {customerInfo.city}, {customerInfo.state} {customerInfo.zipCode}</p>
                  <p><strong>{t('confirmation.country')}:</strong> {customerInfo.country}</p>
                </div>
              </div>
            </div>

            {/* Policy Details */}
            {policyData && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-bold mb-3 text-blue-800">{t('confirmation.additionalPolicyInfo')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>{t('confirmation.policyStatusCode')}:</strong> {policyData.PolicyStatus}</p>
                    <p><strong>{t('confirmation.organizationCode')}:</strong> {policyData.OrgCode}</p>
                  </div>
                  <div>
                    <p><strong>{t('confirmation.issueUser')}:</strong> {policyData.IssueUserRealName}</p>
                    <p><strong>{t('confirmation.vatRate')}:</strong> {policyData.VatRate}%</p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="text-center text-gray-600 text-sm mt-8 pt-6 border-t">
              <p>{t('confirmation.policyQuestions')}</p>
              <p>{t('confirmation.policyDocuments')}</p>
              <p className="mt-2 font-medium">{t('confirmation.thankYouForChoosing')}</p>
            </div>
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 print:hidden">
          <Button
            color="primary"
            size="lg"
            onPress={() => navigate("/")}
          >
            {t('confirmation.continueShopping')}
          </Button>
          <Button
            variant="bordered"
            size="lg"
            onPress={() => window.print()}
          >
            {t('confirmation.printReceipt')}
          </Button>
          <Button
            variant="light"
            size="lg"
            onPress={() => {
              clearStore();
              setCurrentStep('cart');
              addNotification(t('notification.startingNewOrder'), "info");
            }}
          >
            {t('confirmation.newOrder')}
          </Button>
          <Button
            variant="bordered"
            size="lg"
            onPress={() => window.open("https://softtek-sandbox-am.insuremo.com/ui/admin/#/", "_blank")}
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            {t('confirmation.viewInInsureMo')}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="max-w-6xl w-full px-4">
          {/* Header with Step Indicator */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <ShoppingCart className="text-primary" />
              {currentStep === 'cart' && t('cart.title')}
              {currentStep === 'checkout' && t('checkout.title')}
              {currentStep === 'confirmation' && t('confirmation.title')}
            </h1>

            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center ${currentStep === 'cart' ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 'cart' ? 'border-primary bg-primary text-white' : 'border-gray-300'
                    }`}>
                    1
                  </div>
                  <span className="ml-2 font-medium">{t('cart.step')}</span>
                </div>

                <div className={`w-16 h-1 ${currentStep !== 'cart' ? 'bg-primary' : 'bg-gray-300'}`}></div>

                <div className={`flex items-center ${currentStep === 'checkout' ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 'checkout' ? 'border-primary bg-primary text-white' :
                    currentStep === 'confirmation' ? 'border-primary bg-primary text-white' : 'border-gray-300'
                    }`}>
                    2
                  </div>
                  <span className="ml-2 font-medium">{t('checkout.step')}</span>
                </div>

                <div className={`w-16 h-1 ${currentStep === 'confirmation' ? 'bg-primary' : 'bg-gray-300'}`}></div>

                <div className={`flex items-center ${currentStep === 'confirmation' ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 'confirmation' ? 'border-primary bg-primary text-white' : 'border-gray-300'
                    }`}>
                    3
                  </div>
                  <span className="ml-2 font-medium">{t('confirmation.step')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content based on current step */}
          {currentStep === 'cart' && renderCartStep()}
          {currentStep === 'checkout' && renderCheckoutStep()}
          {currentStep === 'confirmation' && renderConfirmationStep()}
        </div>
      </section>
    </DefaultLayout>
  );
}