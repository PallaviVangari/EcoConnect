import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../components/Button";
import { Text } from "../components/Text";
import { Img } from "../components/Img";
import { Heading } from "../components/Heading";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sellerId: string;
  postedDate?: string;
  image?: string; // Added image property
}

interface CartItem {
  product: Product;
  quantity: number;
}

export const Marketplace: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [showManageProducts, setShowManageProducts] = useState(false);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
  });

  useEffect(() => {
    fetchProducts();
    if (isAuthenticated && user) {
      fetchUserProducts();
    }
  }, [isAuthenticated, user]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8070/api/marketplace/getAllProducts"
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchUserProducts = async () => {
    if (!user) return;
    try {
      const response = await axios.get(
        `http://localhost:8070/api/marketplace/seller/${user.sub}/products`
      );
      setUserProducts(response.data);
    } catch (error) {
      console.error("Error fetching user products:", error);
    }
  };

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);
      return updatedCart;
    });
  };

  const handleBuyNow = () => {
    if (cart.length === 0) return;
    alert("Thanks for your purchase!");
    setCart([]);
    setShowCartPopup(false);
  };

  const createOrUpdateProduct = async () => {
    if (!user) return;
    try {
      const productData = { ...newProduct, sellerId: user.sub };
      if (editingProduct) {
        await axios.put(
          `http://localhost:8070/api/marketplace/${editingProduct.id}/updateProduct/${user.sub}`,
          productData
        );
        setEditingProduct(null);
      } else {
        await axios.post(
          "http://localhost:8070/api/marketplace/createProduct",
          productData
        );
      }
      setNewProduct({ name: "", description: "", price: 0 });
      fetchUserProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!user) return;
    try {
      await axios.delete(
        `http://localhost:8070/api/marketplace/${productId}/deleteProduct/${user.sub}`
      );
      fetchUserProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const editProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="container mx-auto px-6 md:px-8 py-10">
        <div className="flex justify-between items-center mb-6">
          <Heading
            size="headinglg"
            as="h1"
            className="text-[24px] font-bold text-[#1d3016]"
          >
            Marketplace
          </Heading>
          <Button
            onClick={() => setShowManageProducts(!showManageProducts)}
            className="bg-[#1d3016] text-white px-6 py-3 rounded-md hover:bg-[#162c10] transition-all"
          >
            {showManageProducts ? "View Marketplace" : "Manage My Products"}
          </Button>
        </div>

        {showManageProducts ? (
          <div>
            <Heading
              size="headingmd"
              as="h2"
              className="text-[20px] font-semibold text-[#1d3016] mb-4"
            >
              Manage Your Products
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white shadow-lg rounded-xl border-2 border-[#1d3016] p-6 hover:shadow-xl transition-all duration-300"
                >
                  <Img
                    src={product.image || "images/logistics-transfer.svg"} // Placeholder image
                    alt={product.name}
                    className="h-[150px] w-full object-cover rounded-md mb-4"
                  />
                  <Text
                    size="textlg"
                    className="text-4xl font-medium text-[#1d3016] mb-2"
                  >
                    {product.name}
                  </Text>
                  <Text
                    size="textmd"
                    as="p"
                    className="text-[14px] text-gray-600 mb-2"
                  >
                    {product.description}
                  </Text>
                  <Text
                    size="textlg"
                    as="p"
                    className="text-[16px] font-bold text-[#1d3016] mb-4"
                  >
                    ${product.price}
                  </Text>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => editProduct(product)}
                      className="bg-[#1d3016] text-white px-4 py-2 rounded-md hover:bg-[#162c10] transition-all"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => deleteProduct(product.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <Heading
              size="headingmd"
              as="h2"
              className="text-[20px] font-semibold text-[#1d3016] mb-4"
            >
              All Products
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white shadow-lg rounded-xl border-2 border-[#1d3016] p-6 hover:shadow-xl transition-all duration-300"
                >
                  <Img
                    src={product.image || "images/logistics-transfer.svg"} // Placeholder image
                    alt={product.name}
                    className="h-[150px] w-full object-contain rounded-md mb-4"
                  />
                  <Text className="text-xl font-medium text-[#1d3016] mb-2">
                    {product.name}
                  </Text>
                  <Text
                    size="textlg"
                    as="p"
                    className="text-xl font-bold text-[#1d3016] mb-4"
                  >
                    ${product.price}
                  </Text>
                  <Button
                    onClick={() => addToCart(product)}
                    className="bg-[#1d3016] text-white px-4 py-2 rounded-md hover:bg-[#162c10] transition-all"
                  >
                    Add to Cart
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
