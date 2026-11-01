
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "rentifyCart";

export function CartProvider({ children }) {
  // Load cart from localStorage
  const [items, setItems] = useState(() => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      // Support older cart items without quantity
      return savedCart.map((item) => ({
        ...item,
        quantity: Math.max(1, Number(item.quantity) || 1),
      }));
    } catch {
      return [];
    }
  });

  const [notification, setNotification] = useState(null);

  // Save cart whenever items change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Automatically hide notifications
  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [notification]);

  // Show notification
  const showNotification = (type, message) => {
    setNotification({
      id: Date.now(),
      type,
      message,
    });
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  // Cart city
  const city = items[0]?.location || null;

  // Add product or increase quantity
  const addToCart = (product) => {
    // Check availability
    if (product.available === false) {
      const message = `${product.name} is currently unavailable.`;

      showNotification("error", message);

      return {
        ok: false,
        message,
      };
    }

    // Check city restriction
    if (
      city &&
      product.location?.toLowerCase() !== city.toLowerCase()
    ) {
      const message =
        `Your cart contains products from ${city}. ` +
        `Please complete or clear your current cart before adding products from ${product.location}.`;

      showNotification("error", message);

      return {
        ok: false,
        message,
      };
    }

    // Check whether product already exists
    const existingItem = items.find(
      (item) => item.id === product.id
    );

    if (existingItem) {
      setItems((current) =>
        current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: (Number(item.quantity) || 1) + 1,
              }
            : item
        )
      );

      const message = `${product.name} quantity increased.`;

      showNotification("success", message);

      return {
        ok: true,
        message,
      };
    }

    // Add new product
    setItems((current) => [
      ...current,
      {
        ...product,
        quantity: 1,
        startDate: "",
        endDate: "",
      },
    ]);

    const message = `${product.name} added to your cart.`;

    showNotification("success", message);

    return {
      ok: true,
      message,
    };
  };

  // Increase quantity
  const increaseQuantity = (id) => {
    const item = items.find(
      (product) => product.id === id
    );

    if (!item) return;

    setItems((current) =>
      current.map((product) =>
        product.id === id
          ? {
              ...product,
              quantity: (Number(product.quantity) || 1) + 1,
            }
          : product
      )
    );

    showNotification(
      "success",
      `${item.name} quantity increased.`
    );
  };

  // Decrease quantity
  const decreaseQuantity = (id) => {
    const item = items.find(
      (product) => product.id === id
    );

    if (!item) return;

    if ((Number(item.quantity) || 1) <= 1) {
      removeFromCart(id);
      return;
    }

    setItems((current) =>
      current.map((product) =>
        product.id === id
          ? {
              ...product,
              quantity: product.quantity - 1,
            }
          : product
      )
    );

    showNotification(
      "success",
      `${item.name} quantity decreased.`
    );
  };

  // Remove product
  // Remove product
const removeFromCart = (id) => {
  const removedItem = items.find(
    (item) => item.id === id
  );

  setItems((current) =>
    current.filter((item) => item.id !== id)
  );

  showNotification(
    "success",
    `${removedItem?.name || "Product"} removed from your cart.`
  );
};
  // Update individual rental dates
  const updateDates = (id, field, value) => {
    if (!["startDate", "endDate"].includes(field)) {
      return;
    }

    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;

        if (
          field === "startDate" &&
          item.endDate &&
          value >= item.endDate
        ) {
          return {
            ...item,
            startDate: value,
            endDate: "",
          };
        }

        return {
          ...item,
          [field]: value,
        };
      })
    );
  };

  // Calculate rental days
  const getRentalDays = (item) => {
    if (!item.startDate || !item.endDate) {
      return 0;
    }

    const start = new Date(`${item.startDate}T00:00:00`);
    const end = new Date(`${item.endDate}T00:00:00`);

    const difference =
      (end.getTime() - start.getTime()) /
      (1000 * 60 * 60 * 24);

    return difference > 0 ? difference : 0;
  };

  // Calculate individual product cost
  const getItemTotal = (item) => {
    const days = getRentalDays(item);
    const quantity = Number(item.quantity) || 1;

    return days * Number(item.price) * quantity;
  };

  // Calculate total number of units
  const cartCount = items.reduce(
    (total, item) => total + (Number(item.quantity) || 1),
    0
  );

  // Calculate complete cart total
  const cartTotal = items.reduce(
    (total, item) => total + getItemTotal(item),
    0
  );

  // Clear complete cart
  const clearCart = () => {
    setItems([]);

    showNotification(
      "success",
      "Your cart has been cleared."
    );
  };

  // Context values
  const value = useMemo(
    () => ({
      items,
      city,
      cartCount,
      cartTotal,

      notification,

      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,

      updateDates,
      getRentalDays,
      getItemTotal,

      clearCart,

      showNotification,
      dismissNotification,
    }),
    [items, city, cartCount, cartTotal, notification]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}