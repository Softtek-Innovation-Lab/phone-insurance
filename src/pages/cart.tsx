// pages/CartPage.tsx
import { useGlobalStore } from "@/hooks/useGlobalStore";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { Input } from "@heroui/input";
import { useNavigate } from "react-router-dom";

// Static content
const TEXT_CONTENT = {
  title: "Shopping Cart",
  emptyMessage: "Your cart is empty.",
  headers: ["Item", "Unit Price", "Subtotal"],
  continueShopping: "Continue Shopping",
  clearCart: "Clear Shopping Cart",
  subtotal: "Subtotal",
  processingFee: "Processing Fee (USD)",
  orderTotal: "Order Total (USD)",
  proceedToCheckout: "Proceed to Checkout",
};

// Mock cart item (initial data)
const INITIAL_CART_ITEM = {
  id: "item1",
  name: "Phone Insurance",
  makeModel: "Make & Model: 123 23 (223)",
  coverage: "Coverage Amount: Full Coverage",
  deductible: "Deductible: $75.00",
  policyTerm: "Policy Term: 3 Year",
  paymentTerm: "Payment Term: Annual One-Time",
  unitPrice: 154.00,
  quantity: 1,
  image: "https://img.freepik.com/free-vector/smartphone_53876-80286.jpg?t=st=1741271099~exp=1741274699~hmac=1d932fc53e6acc9908fdef6091f92a5ea881633c4af244a6df0b8f19d424ff23&w=740",
};


export default function CartPage() {
  const { store, setStore, clearStore } = useGlobalStore();

  const navigate = useNavigate();
  const cart = store.cart?.map((item) => ({ ...INITIAL_CART_ITEM, ...item })) || [];

  const updateQuantity = (id: string, quantity: number) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    setStore({ cart: updatedCart });
  };

  const removeItem = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setStore({ cart: updatedCart.length ? updatedCart : null }); // Clear store if empty
  };

  const subtotal = cart && cart[0]?.unitPrice * cart[0]?.quantity; // Assuming single item for now
  const processingFee = 5.00;
  const orderTotal = subtotal + processingFee;

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="max-w-6xl w-full px-4">
          <h1 className="text-2xl font-bold mb-6">{TEXT_CONTENT.title}</h1>

          {/* Cart Header */}
          <div className="grid grid-cols-3 gap-4 mb-4 text-white bg-gray-800 p-2 rounded-t-md">
            {TEXT_CONTENT.headers.map((header) => (
              <span key={header} className="text-center font-medium">
                {header}
              </span>
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
              <CardBody>
                {cart?.map((item) => (
                  <div key={item?.id} className="grid grid-cols-3 gap-4 items-center py-2 border-b last:border-b-0">
                    <div className="flex items-center gap-4">
                      <Image
                        alt={item?.name}
                        src={item?.image}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div>
                        <p className="font-medium">{item?.name}</p>
                        <p className="text-sm text-default-500">{item?.makeModel}</p>
                        <p className="text-sm text-default-500">{item?.coverage}</p>
                        <p className="text-sm text-default-500">{item?.deductible}</p>
                        <p className="text-sm text-default-500">{item?.policyTerm}</p>
                        <p className="text-sm text-default-500">{item?.paymentTerm}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="font-medium">${item.unitPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">${(item?.unitPrice * item?.quantity).toFixed(2)}</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={1}
                          value={item?.quantity}
                          onChange={(e) => updateQuantity(item?.id, parseInt(e.target.value) || 1)}
                          className="w-16"
                        />
                        <Button
                          isIconOnly
                          color="danger"
                          variant="light"
                          onClick={() => removeItem(item.id)}
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between mb-6">
            <Button variant="light" onPress={() => {setStore({ cart: [] }); navigate("/");}}>
              {TEXT_CONTENT.continueShopping}
            </Button>
            <Button variant="light" color="danger" onPress={() => clearStore()}>
              {TEXT_CONTENT.clearCart}
            </Button>
          </div>

          {/* Summary */}
          {cart.length > 0 && (
            <Card className="bg-gray-100">
              <CardBody className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span>{TEXT_CONTENT.subtotal}</span>
                  <span>${subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{TEXT_CONTENT.processingFee}</span>
                  <span>${processingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>{TEXT_CONTENT.orderTotal}</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
                <Button color="primary" size="lg" className="mt-4">
                  {TEXT_CONTENT.proceedToCheckout}
                </Button>
              </CardBody>
            </Card>
          )}
        </div>
      </section>
    </DefaultLayout>
  );
}