// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();

/* ================= DATABASE ================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("Mongo Error ❌", err));

/* ================= MIDDLEWARE ================= */
app.set("trust proxy", 1); // Trust the first proxy (Render)

const allowedOrigins = [
  "http://localhost:5173",
  "https://nexa-ip26.onrender.com",
  "https://nexa-infotech.vercel.app",
  "https://tubular-speculoos-df6c39.netlify.app",
  "https://nexainfotech.netlify.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= SESSION ================= */
app.use(session({
  name: "nexa.sid",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
  }),
  cookie: {
    httpOnly: true,
    secure: true, // Always true for cross-site cookies
    sameSite: 'none', // Required for cross-site cookies
    maxAge: 1000 * 60 * 60 * 24
  }
}));

/* ================= CLOUDINARY CONFIG ================= */
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

console.log("☁️ Cloudinary Configured");
app.locals.cloudinary = cloudinary;

/* ================= ROUTES ================= */
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/gallery", require("./routes/galleryRoutes"));
app.use("/api/portfolio", require("./routes/portfolioRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/navbar", require("./routes/navbarRoutes"));
app.use("/api/heroes", require("./routes/heroRoutes"));
app.use("/api/pages", require("./routes/pageRoutes"));

/* ================= HOME ROUTE ================= */
app.get("/", (req, res) => {
  res.send("🚀 Nexa Backend API Running Successfully");
});

/* ================= ERROR HANDLER ================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found ❌" });
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📧 Email: ${process.env.EMAIL_USER ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`🌐 Frontend: http://localhost:5173\n`);
});