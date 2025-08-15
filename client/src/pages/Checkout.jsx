import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import API from "../api";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    paymentMethod: "cash",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    try {
      const buyer = localStorage.getItem("userId");
      // Only include items with a valid seller ObjectId (24 hex chars)
      const items = cartItems
        .filter(
          (item) =>
            item.sellerId &&
            typeof item.sellerId === "string" &&
            item.sellerId.length === 24
        )
        .map((item) => ({
          product: item._id,
          seller: item.sellerId,
          qty: item.quantity,
          price: item.price,
        }));
      if (items.length === 0) {
        alert("No valid items with seller found in cart.");
        return;
      }
      const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
      await API.post("/api/orders", { buyer, items, total });
      clearCart();
      alert("Order placed successfully!");
      navigate("/order-success");
    } catch (err) {
      alert("Error placing order. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="checkout-form">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Delivery Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label>
          <strong>Payment Method:</strong>
        </label>
        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
        >
          <option value="cash">Cash on Delivery</option>
          <option value="card">Card Payment</option>
        </select>

        {formData.paymentMethod === "card" && (
          <>
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              value={formData.cardNumber}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="expiry"
              placeholder="Expiry (MM/YY)"
              value={formData.expiry}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              value={formData.cvv}
              onChange={handleChange}
              required
            />
          </>
        )}

        <button type="submit" className="submit-btn">
          Place Order
        </button>
      </form>
    </div>
  );
}
