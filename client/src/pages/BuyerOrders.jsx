import React, { useEffect, useState } from "react";
import API from "../api";

export default function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const containerStyle = {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
    backgroundColor: "#fdf6f0",
    borderRadius: "10px",
    fontFamily: "Arial, sans-serif",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  };

  const itemStyle = { paddingLeft: 10, marginBottom: 6 };
  const titleStyle = { fontSize: 24, marginBottom: 20, color: "#cc6600", fontWeight: "bold" };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Your Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orders.map((order) => {
          const items = order.items || order.products || [];
          const total = order.total ?? order.totalAmount ?? 0;
          const created =
            order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-";
          const status = order.status || "Processing";

          return (
            <div key={order._id} style={cardStyle}>
              <h3>Order #{order._id?.slice?.(-6) || ""}</h3>
              <p><strong>Date:</strong> {created}</p>
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Total:</strong> Rs {total}</p>

              <div style={{ marginTop: 10 }}>
                <strong>Items:</strong>
                {items.length === 0 ? (
                  <div style={itemStyle}>—</div>
                ) : (
                  items.map((item, i) => {
                    const name = item.product?.name ?? item.name ?? "Item";
                    const qty = item.qty ?? item.quantity ?? 1;
                    const unitPrice = item.price ?? item.unitPrice;
                    const extras = [];
                    if (item.ukSize) extras.push(`Size: ${item.ukSize}`);
                    if (item.specialRequest) extras.push(`Request: ${item.specialRequest}`);

                    return (
                      <div key={i} style={itemStyle}>
                        - {name} (Qty: {qty}
                        {typeof unitPrice === "number" ? ` · Rs ${unitPrice}` : ""}
                        )
                        {extras.length > 0 && <> — {extras.join(" | ")}</>}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
