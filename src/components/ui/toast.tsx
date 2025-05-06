import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-md p-4 shadow-md transition-all",
        {
          "bg-success-100 text-success-700 border border-success-300": type === "success",
          "bg-danger-100 text-danger-700 border border-danger-300": type === "error",
          "bg-info-100 text-info-700 border border-info-300": type === "info",
          "bg-warning-100 text-warning-700 border border-warning-300": type === "warning",
        }
      )}
    >
      <span>{message}</span>
      <button
        onClick={handleClose}
        className="ml-2 rounded-full p-1 hover:bg-black/10"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;