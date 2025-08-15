const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Import Routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const preOrderRoutes = require("./routes/preOrderRoutes");
const shopRoutes = require("./routes/shopRoutes");
const materialOrderRoutes = require("./routes/materialOrderRoutes");

dotenv.config();

const app = express();

// ===== CORS Setup =====
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173", // Local dev or env
  "https://lankafashion-hazel.vercel.app"           // Production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS policy: Origin not allowed"));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Root test route
app.get("/", (req, res) => {
  res.send("🚀 Server is running and ready!");
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/preorder", preOrderRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/material-orders", materialOrderRoutes);

// MongoDB connection and server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    const PORT = process.env.PORT || 5000; // Render assigns PORT automatically
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });
