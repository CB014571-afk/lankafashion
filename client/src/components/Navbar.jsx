import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../pics/logo.jpeg";
import { useAuth } from "../context/AuthContext";

const linkStyle = {
  textDecoration: "none",
  fontWeight: "bold",
  color: "#222",
};

const buttonStyle = {
  ...linkStyle,
  background: "transparent",
  border: "none",
  cursor: "pointer",
};

export default function Navbar() {
  const navigate = useNavigate();
  const { role: ctxRole, token, user, logout } = useAuth();

  // fallback so UI is correct even during context hydration
  const role = ctxRole ?? localStorage.getItem("role");
  const name = user?.name ?? localStorage.getItem("name");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        backgroundColor: "#e2b455",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 30px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        borderRadius: "8px",
      }}
    >
      {/* Logo + Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        <img src={logo} alt="logo" style={{ width: 40, height: 40, borderRadius: 10 }} />
        <span style={{ fontSize: 24, fontWeight: "bold", color: "#222", fontFamily: "Georgia" }}>
          LankaFashion
        </span>
      </div>

      {/* Links */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          flex: 1,
        }}
      >
        {/* Buyer / default menu */}
        {(!role || role === "buyer") && (
          <>
            <Link to="/" style={linkStyle}>Home</Link>
            <Link to="/shop" style={linkStyle}>Shop</Link>
            <Link to="/cart" style={{ ...linkStyle, fontSize: 22 }}>🛒</Link>
            {!token ? (
              <>
                <Link to="/register" style={linkStyle}>Register</Link>
                <Link to="/login" style={linkStyle}>Login</Link>
              </>
            ) : (
              <button onClick={handleLogout} style={buttonStyle}>Logout</button>
            )}
          </>
        )}


        {/* Seller menu */}
        {role === "seller" && (
          <>
            <Link to="/seller" style={linkStyle}>Seller Dashboard</Link>
            <Link to="/seller-orders" style={linkStyle}>Orders</Link>
            <Link to="/preorder" style={linkStyle}>Pre-Order Materials</Link>
            <button onClick={handleLogout} style={buttonStyle}>Logout</button>
          </>
        )}

        {/* Supplier menu */}
        {role === "supplier" && (
          <>
            <Link to="/supplier-dashboard" style={linkStyle}>Supplier Dashboard</Link>
            <Link to="/supplier-preorders" style={linkStyle}>PreOrders</Link>
            <button onClick={handleLogout} style={buttonStyle}>Logout</button>
          </>
        )}

        {/* Admin (placeholder) */}
        {role === "admin" && (
          <>
            <Link to="/" style={linkStyle}>Admin Dashboard</Link>
            <button onClick={handleLogout} style={buttonStyle}>Logout</button>
          </>
        )}
      </div>

      {/* Language Selector + greeting */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {token && name && <span style={{ color: "#333" }}>Hi, {name}</span>}
        <select style={{ padding: "5px 10px", borderRadius: 8, border: "none" }}>
          <option>English</option>
          <option>සිංහල</option>
          <option>தமிழ்</option>
        </select>
      </div>
    </nav>
  );
}
