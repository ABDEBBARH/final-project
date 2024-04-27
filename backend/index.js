import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cloudinary from 'cloudinary';

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

// Cloudinary configuration
cloudinary.config({
  cloud_name: "dqqj4tzk6",
  api_key: "357831443477426",
  api_secret: "IzJLoNtwgSKjXx4y2JkCzqfULLs"
});

// Handle image uploads to Cloudinary
app.post("/api/upload", async (req, res) => {
  try {
    const fileStr = req.body.data;
    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET
    });
    res.status(201).json({ imageUrl: uploadedResponse.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

app.listen(port, () => console.log(`Server running on port: ${port}`));
