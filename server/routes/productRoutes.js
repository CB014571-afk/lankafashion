const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { auth, requireRole } = require("../middleware");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort("-createdAt").populate({
      path: "seller",
      select: "_id shopName"
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/mine", auth, requireRole("seller"), async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort("-createdAt");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/add", auth, requireRole("seller"), async (req, res) => {
  try {
    const { name, description, price, category, shopName, images } = req.body;
    const finalShopName = shopName || req.user.shopName;

    const product = await Product.create({
      seller: req.user._id,
      shopName: finalShopName,
      name,
      description,
      price,
      category,
      images: Array.isArray(images)
        ? images
        : images
        ? images.split(",").map(s => s.trim())
        : [],
    });

    const products = await Product.find({ seller: req.user._id }).sort("-createdAt");
    res.status(201).json({ message: "Product added successfully", product, products });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id([0-9a-fA-F]{24})", auth, requireRole("seller"), async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { _id: req.params.id, seller: req.user._id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id([0-9a-fA-F]{24})", auth, requireRole("seller"), async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, shopName } = req.query;
    const query = {};

    if (keyword) query.name = { $regex: keyword, $options: "i" };
    if (category) query.category = category;
    if (shopName) query.shopName = shopName;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query).sort("-createdAt").populate({
      path: "seller",
      select: "_id shopName"
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/meta", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    const shopNames = await Product.distinct("shopName");
    res.json({ categories, shopNames });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
