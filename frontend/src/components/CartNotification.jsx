import {
  MapPin,
  CheckCircle,
  AlertCircle,
  X,
  Info,
} from "lucide-react";

import { useCart } from "./CartContext";
import "./CartNotification.css";

function CartNotification() {
  const { notification, dismissNotification } = useCart();

  if (!notification) return null;

  const icons = {
    success: <CheckCircle size={22} />,
    error: <MapPin size={22} />,
    warning: <Info size={22} />,
  };

  const titles = {
  success: "Cart updated successfully",
  error: "Different city detected",
  warning: "Already in your cart",
};
  return (
    <div
      className={`rentify-toast toast-${notification.type}`}
      key={notification.id}
      role="status"
      aria-live="polite"
    >
      <div className="toast-icon">
        {icons[notification.type] || <AlertCircle size={22} />}
      </div>

      <div className="toast-content">
        <strong>
          {titles[notification.type] || "Notification"}
        </strong>

        <p>{notification.message}</p>
      </div>

      <button
        className="toast-close"
        onClick={dismissNotification}
        aria-label="Close notification"
      >
        <X size={18} />
      </button>
    </div>
  );
}

export default CartNotification;