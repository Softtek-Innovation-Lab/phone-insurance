import { Button } from "@heroui/button";

interface ConfirmationStepProps {
  productName: string;
  navigateToCart: () => void;
}

export const ConfirmationStep = ({ 
  productName, 
  navigateToCart 
}: ConfirmationStepProps) => {
  return (
    <div className="w-full grid grid-cols-1 gap-4">
      <div className="flex flex-col items-center justify-center p-6 bg-success/10 rounded-medium">
        <h3 className="text-xl font-bold text-success mb-2">Application Completed!</h3>
        <p className="text-default-600 text-center">
          Thank you for choosing our {productName.toLowerCase()}. We have successfully received your application.
          You will soon receive an email with your policy details and next steps.
          Your device is on its way to being protected!
        </p>
        <Button
          color="success"
          className="mt-4 text-white"
          onClick={navigateToCart}
        >
          Go to cart
        </Button>
      </div>
    </div>
  );
};