import React, { useEffect, useState } from "react";
import API from "../api"; // ✅ Use the configured axios instance
import AddToCartModal from "../components/AddToCartModal";
import "./Shop.css";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [shopName, setShopName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [shopNames, setShopNames] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [shopInfo, setShopInfo] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      if (shopName) {
        // Shop details & products
        const res = await API.get(
          `/api/shops/${encodeURIComponent(shopName.trim())}`
        );
        setProducts(res.data.products || []);
        setShopInfo({
          shopName: res.data.shopName,
          description: res.data.description || "",
          email: res.data.email || "",
          contactNumber: res.data.contactNumber || "",
        });
      } else {
        // All products (optionally filtered by category)
        const query = [];
        if (category) query.push(`category=${encodeURIComponent(category)}`);
        const res = await API.get(`/api/products/search?${query.join("&")}`);
        setProducts(res.data);
        setShopInfo(null);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeta = async () => {
    try {
      const res = await API.get("/api/products/meta");
      setCategories(res.data.categories || []);
      setShopNames(res.data.shopNames || []);
    } catch (err) {
      console.error("Error fetching meta data:", err);
    }
  };

  useEffect(() => {
    fetchMeta();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [category, shopName]);

  return (
    <div className="shop-container">
      <h2 className="shop-title">🛍️ Browse Products</h2>

      <div className="filter-bar">
        {/* Shop dropdown */}
        <select
          value={shopName}
          onChange={(e) => {
            setShopName(e.target.value.trim());
            setCategory("");
          }}
        >
          <option value="">All Shops</option>
          {shopNames.map((name, i) => (
            <option key={i} value={name.trim()}>
              {name.trim()}
            </option>
          ))}
        </select>

        {/* Category dropdown */}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setShopName("");
          }}
        >
          <option value="">All Categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Reset */}
        <button
          onClick={() => {
            setCategory("");
            setShopName("");
            setShopInfo(null);
            fetchProducts();
          }}
        >
          Reset
        </button>
      </div>

      {/* Shop Info */}
      {shopInfo && (
        <div className="shop-description">
          <h3>{shopInfo.shopName}</h3>
          <p>{shopInfo.description}</p>
          {shopInfo.email && (
            <p>
              <strong>Email:</strong> {shopInfo.email}
            </p>
          )}
          {shopInfo.contactNumber && (
            <p>
              <strong>Contact:</strong> {shopInfo.contactNumber}
            </p>
          )}
        </div>
      )}

      {/* Product List */}
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <div className="product-grid">
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            products.map((product) => (
              <div key={product._id} className="product-card">
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="product-image"
                  />
                )}
                <h3 className="product-title">{product.name}</h3>
                <p>
                  <strong>Rs:</strong> {product.price}
                </p>
                <p>
                  <strong>Category:</strong> {product.category}
                </p>
                <p>
                  <strong>Shop:</strong> {product.shopName || "Unknown"}
                </p>
                <p className="desc">{product.description}</p>
                <div className="btn-wrapper">
                  <button
                    className="cart-btn"
                    onClick={() => setSelectedProduct(product)}
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add to Cart Modal */}
      {selectedProduct && (
        <AddToCartModal
          product={{
            name: selectedProduct.name,
            image: selectedProduct.images?.[0],
            shopName: selectedProduct.shopName,
            price: selectedProduct.price,
            _id: selectedProduct._id,
            sellerId: selectedProduct.seller?._id || selectedProduct.seller,
          }}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
