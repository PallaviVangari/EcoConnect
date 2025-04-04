// import React from 'react';
// import { Search, Filter, Plus, Tag, ShoppingBag, X } from 'lucide-react';
// import type { MarketplaceItem } from '../types';
//
// export function Marketplace() {
//   const [searchQuery, setSearchQuery] = React.useState('');
//   const [activeCategory, setActiveCategory] = React.useState<'all' | 'recycled' | 'eco-friendly' | 'sustainable'>('all');
//   const [showCreateModal, setShowCreateModal] = React.useState(false);
//   const [items, setItems] = React.useState<MarketplaceItem[]>([
//     {
//       id: '1',
//       title: 'Handmade Recycled Paper Notebook',
//       description: 'Beautiful notebook made from 100% recycled paper. Perfect for eco-conscious note-taking.',
//       price: 15.99,
//       seller: {
//         id: '1',
//         name: 'Emma Wilson',
//         email: 'emma@example.com',
//         avatar: 'https://i.pravatar.cc/150?u=emma',
//         followers: 1542,
//         following: 891
//       },
//       images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop'],
//       category: 'recycled',
//       condition: 'new',
//       status: 'available',
//       createdAt: new Date().toISOString(),
//       tags: ['stationery', 'recycled', 'handmade']
//     },
//     {
//       id: '2',
//       title: 'Bamboo Cutlery Set',
//       description: 'Sustainable bamboo cutlery set including fork, knife, spoon, and chopsticks. Perfect for on-the-go meals.',
//       price: 24.99,
//       seller: {
//         id: '2',
//         name: 'David Chen',
//         email: 'david@example.com',
//         avatar: 'https://i.pravatar.cc/150?u=david',
//         followers: 2103,
//         following: 764
//       },
//       images: ['https://images.unsplash.com/photo-1584346133934-a3c3f0e75d0e?w=800&auto=format&fit=crop'],
//       category: 'eco-friendly',
//       condition: 'new',
//       status: 'available',
//       createdAt: new Date().toISOString(),
//       tags: ['kitchen', 'bamboo', 'zero-waste']
//     }
//   ]);
//
//   // New item form state
//   const [newItem, setNewItem] = React.useState({
//     title: '',
//     description: '',
//     price: 0,
//     category: 'recycled' as 'recycled' | 'eco-friendly' | 'sustainable',
//     condition: 'new' as 'new' | 'used' | 'refurbished',
//     tags: ''
//   });
//
//   const handleCreateItem = () => {
//     // Validate form
//     if (!newItem.title || !newItem.description || newItem.price <= 0) {
//       return;
//     }
//
//     const createdItem: MarketplaceItem = {
//       id: Date.now().toString(),
//       title: newItem.title,
//       description: newItem.description,
//       price: newItem.price,
//       category: newItem.category,
//       condition: newItem.condition,
//       seller: {
//         id: 'current-user',
//         name: 'John Doe',
//         email: 'john@example.com',
//         avatar: 'https://i.pravatar.cc/150?u=john',
//         followers: 245,
//         following: 189
//       },
//       images: ['https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=800&auto=format&fit=crop'],
//       status: 'available',
//       createdAt: new Date().toISOString(),
//       tags: newItem.tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag)
//     };
//
//     setItems([createdItem, ...items]);
//     setShowCreateModal(false);
//     setNewItem({
//       title: '',
//       description: '',
//       price: 0,
//       category: 'recycled',
//       condition: 'new',
//       tags: ''
//     });
//   };
//
//   const filteredItems = items.filter(item =>
//     (activeCategory === 'all' || item.category === activeCategory) &&
//     (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
//   );
//
//   return (
//     <div className="max-w-5xl mx-auto">
//       {/* Header */}
//       <div className="flex justify-between items-start mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
//           <p className="text-gray-600">Buy and sell eco-friendly and recycled products</p>
//         </div>
//         <button
//           className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors active:scale-95"
//           onClick={() => setShowCreateModal(true)}
//         >
//           <Plus className="h-5 w-5" />
//           <span>List Item</span>
//         </button>
//       </div>
//
//       {/* Search and Filter */}
//       <div className="bg-white rounded-lg shadow p-4 mb-6">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1 relative">
//             <input
//               type="text"
//               placeholder="Search items..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//             />
//             <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
//           </div>
//           <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 active:scale-95 transition-transform">
//             <Filter className="h-5 w-5 text-gray-500" />
//             <span>Filters</span>
//           </button>
//         </div>
//       </div>
//
//       {/* Category Tabs */}
//       <div className="border-b border-gray-200 mb-6">
//         <nav className="flex space-x-8 overflow-x-auto pb-1">
//           {(['all', 'recycled', 'eco-friendly', 'sustainable'] as const).map((category) => (
//             <button
//               key={category}
//               onClick={() => setActiveCategory(category)}
//               className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
//                 activeCategory === category
//                   ? 'border-green-500 text-green-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
//             </button>
//           ))}
//         </nav>
//       </div>
//
//       {/* Items Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredItems.map((item) => (
//           <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
//             <div className="aspect-w-4 aspect-h-3">
//               <img
//                 src={item.images[0]}
//                 alt={item.title}
//                 className="w-full h-48 object-cover rounded-t-lg"
//               />
//             </div>
//             <div className="p-4">
//               <div className="flex justify-between items-start mb-2">
//                 <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
//                 <span className="text-lg font-bold text-green-600">${item.price.toFixed(2)}</span>
//               </div>
//
//               <p className="text-gray-600 text-sm mb-4">{item.description}</p>
//
//               <div className="flex flex-wrap gap-2 mb-4">
//                 {item.tags.map(tag => (
//                   <span
//                     key={tag}
//                     className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs flex items-center cursor-pointer hover:bg-gray-200"
//                   >
//                     <Tag className="h-3 w-3 mr-1" />
//                     {tag}
//                   </span>
//                 ))}
//               </div>
//
//               <div className="flex items-center justify-between pt-4 border-t">
//                 <div className="flex items-center space-x-2">
//                   <img
//                     src={item.seller.avatar}
//                     alt={`${item.seller.name}'s avatar`}
//                     className="h-8 w-8 rounded-full"
//                   />
//                   <span className="text-sm text-gray-500">{item.seller.name}</span>
//                 </div>
//                 <button className="flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors active:scale-95">
//                   <ShoppingBag className="h-4 w-4" />
//                   <span className="text-sm">Buy Now</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//
//       {/* Create Item Modal */}
//       {showCreateModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-gray-900">List New Item</h2>
//                 <button
//                   onClick={() => setShowCreateModal(false)}
//                   className="text-gray-500 hover:text-gray-700 active:scale-95 transition-transform"
//                 >
//                   <X className="h-6 w-6" />
//                 </button>
//               </div>
//
//               <div className="space-y-4">
//                 <div>
//                   <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
//                     Item Title
//                   </label>
//                   <input
//                     type="text"
//                     id="title"
//                     value={newItem.title}
//                     onChange={(e) => setNewItem({...newItem, title: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     placeholder="Enter item title"
//                   />
//                 </div>
//
//                 <div>
//                   <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//                     Description
//                   </label>
//                   <textarea
//                     id="description"
//                     value={newItem.description}
//                     onChange={(e) => setNewItem({...newItem, description: e.target.value})}
//                     rows={4}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     placeholder="Describe your item"
//                   />
//                 </div>
//
//                 <div>
//                   <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
//                     Price ($)
//                   </label>
//                   <input
//                     type="number"
//                     id="price"
//                     value={newItem.price || ''}
//                     onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
//                     min="0.01"
//                     step="0.01"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     placeholder="0.00"
//                   />
//                 </div>
//
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
//                       Category
//                     </label>
//                     <select
//                       id="category"
//                       value={newItem.category}
//                       onChange={(e) => setNewItem({...newItem, category: e.target.value as any})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     >
//                       <option value="recycled">Recycled</option>
//                       <option value="eco-friendly">Eco-Friendly</option>
//                       <option value="sustainable">Sustainable</option>
//                     </select>
//                   </div>
//
//                   <div>
//                     <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
//                       Condition
//                     </label>
//                     <select
//                       id="condition"
//                       value={newItem.condition}
//                       onChange={(e) => setNewItem({...newItem, condition: e.target.value as any})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     >
//                       <option value="new">New</option>
//                       <option value="used">Used</option>
//                       <option value="refurbished">Refurbished</option>
//                     </select>
//                   </div>
//                 </div>
//
//                 <div>
//                   <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
//                     Tags (comma separated)
//                   </label>
//                   <input
//                     type="text"
//                     id="tags"
//                     value={newItem.tags}
//                     onChange={(e) => setNewItem({...newItem, tags: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     placeholder="e.g. bamboo, kitchen, zero-waste"
//                   />
//                 </div>
//               </div>
//
//               <div className="mt-8 flex justify-end space-x-3">
//                 <button
//                   onClick={() => setShowCreateModal(false)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 active:scale-95 transition-transform"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleCreateItem}
//                   className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95 transition-transform"
//                 >
//                   List Item
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sellerId: string;
  postedDate?: string;
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
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: 0 });

  useEffect(() => {
    fetchProducts();
    if (isAuthenticated && user) {
      fetchUserProducts();
    }
  }, [isAuthenticated, user]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8070/api/marketplace/getAllProducts");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchUserProducts = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`http://localhost:8070/api/marketplace/seller/${user.sub}/products`);
      setUserProducts(response.data);
    } catch (error) {
      console.error("Error fetching user products:", error);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const updatedCart = prevCart.map(item =>
          item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      ).filter(item => item.quantity > 0);
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
        await axios.put(`http://localhost:8070/api/marketplace/${editingProduct.id}/updateProduct/${user.sub}`, productData);
        setEditingProduct(null);
      } else {
        await axios.post("http://localhost:8070/api/marketplace/createProduct", productData);
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
      await axios.delete(`http://localhost:8070/api/marketplace/${productId}/deleteProduct/${user.sub}`);
      fetchUserProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const editProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({ name: product.name, description: product.description, price: product.price });
  };

  return (
      <div className="marketplace-container">
        <h1>Marketplace</h1>

        <button onClick={() => setShowManageProducts(!showManageProducts)}>
          {showManageProducts ? "View Marketplace" : "Manage My Products"}
        </button>

        {showManageProducts ? (
            <div>
              <h2>Manage Your Products</h2>
              <div className="product-form">
                <input type="text" placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                <input type="text" placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                <input type="number" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })} />
                <button onClick={createOrUpdateProduct}>{editingProduct ? "Update Product" : "Create Product"}</button>
              </div>
              <div className="product-grid">
                {userProducts.map(product => (
                    <div key={product.id} className="product-tile">
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <p>${product.price}</p>
                      <button onClick={() => editProduct(product)}>Edit</button>
                      <button onClick={() => deleteProduct(product.id)}>Delete</button>
                    </div>
                ))}
              </div>
            </div>
        ) : (
            <div>
              <h2>All Products</h2>
              <div className="product-grid">
                {products.map(product => (
                    <div key={product.id} className="product-tile">
                      <h3>{product.name}</h3>
                      <p>${product.price}</p>
                      <button onClick={() => addToCart(product)}>Add to Cart</button>
                    </div>
                ))}
              </div>
            </div>
        )}

        {!showManageProducts && <button onClick={() => setShowCartPopup(true)}>Checkout ({cart.reduce((total, item) => total + item.quantity, 0)})</button>}

        {showCartPopup && (
            <div className="cart-popup">
              <h2>Shopping Cart</h2>
              <ul>
                {cart.map(item => (
                    <li key={item.product.id}>
                      {item.product.name} - ${item.product.price} (x{item.quantity})
                      <button onClick={() => removeFromCart(item.product.id)}>Remove</button>
                    </li>
                ))}
              </ul>
              <button onClick={handleBuyNow} disabled={cart.length === 0} style={{ opacity: cart.length === 0 ? 0.5 : 1 }}>Buy Now</button>
              <button onClick={() => setShowCartPopup(false)}>Cancel</button>
            </div>
        )}

        <style jsx>{`
                .marketplace-container {
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }
                button {
                    margin: 5px;
                    padding: 10px;
                    border: none;
                    cursor: pointer;
                    background-color: #28a745;
                    color: white;
                    border-radius: 5px;
                }
                .product-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 15px;
                }
                .product-tile {
                    padding: 15px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    text-align: center;
                    background-color: #f9f9f9;
                }
                .cart-popup {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 20px;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                }
            `}</style>
      </div>
  );
};

