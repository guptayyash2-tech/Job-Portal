const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const router = require("./Router/Userrouter/userrouter");
const adminrouter = require("./Router/adminrouter/adminrouter");
const userpersonalrouter = require("./Router/Userrouter/userpersonal");

dotenv.config();

const index = express();

// Middleware
index.use(cors());
index.use(express.json());
index.use(express.urlencoded({ extended: true }));

// Static folder for uploaded images

// View engine setup (if you use ejs)
index.set("views", "ejs");
index.set("view engine", "ejs");

// MongoDB connection
const DB_PATH =
  "mongodb+srv://joblisting:jgs1PFD5ZamlrERR@group8.mwqmfsy.mongodb.net/?retryWrites=true&w=majority&appName=group8"

const mongostore = require("connect-mongodb-session")(session);

// Routers
index.use("/api", router);
index.use("/admin", adminrouter);
index.use("/api", userpersonalrouter);

// Port
const PORT = 3016;

mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    index.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error while connecting to MongoDB:", err);
  });
 