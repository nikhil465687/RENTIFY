import {
createContext,
useContext,
useEffect,
useState,
} from "react";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const fetchProducts = async () => {
try {
setLoading(true);
setError("");

  const response = await fetch(
    "http://localhost:5050/api/products"
  );
  if (!response.ok) {
    throw new Error("Unable to fetch products.");
  }
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Product loading failed.");
  }
  setProducts(data.products || []);
} catch (err) {
  console.error("Product loading error:", err);
  setError(err.message);
} finally {
  setLoading(false);
}

};

useEffect(() => {
fetchProducts();
}, []);

return (
<ProductContext.Provider
value={{
products,
loading,
error,
refreshProducts: fetchProducts,
}}
>
{children}
</ProductContext.Provider>
);
}

export function useProducts() {
const context = useContext(ProductContext);

if (!context) {
throw new Error(
"useProducts must be used inside ProductProvider"
);
}

return context;
}