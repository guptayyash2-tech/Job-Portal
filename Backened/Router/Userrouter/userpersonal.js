const express = require("express");
const userpersonalrouter = express.Router();
const multer = require("multer");
const protect = require("../../middlewear/usermiddle");

const {
  savePersonalInfo,
  getPersonalInfo,
  updatePersonalInfo,
} = require("../../Controller/userpersonalinformation");

const {
  postresume,
  getResume,
  updateResume,
  deleteResume,
} = require("../../Controller/resume");

// ✅ Use memory storage for both resume + image (base64 conversion later)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// -----------------------------
// 📌 PERSONAL INFO ROUTES
// -----------------------------
userpersonalrouter.post("/savepersonalinfo", protect, savePersonalInfo);
userpersonalrouter.get("/getpersonalinfo", protect, getPersonalInfo);
userpersonalrouter.put("/updatepersonalinfo", protect, updatePersonalInfo);

// -----------------------------
// 📄 RESUME ROUTES
// -----------------------------

// ✅ Create new resume (upload + save)
userpersonalrouter.post(
  "/postresume",
  protect,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  postresume
);

// ✅ Get all resumes for logged-in user
userpersonalrouter.get("/getresumes", protect, getResume);

// ✅ Update a resume (can also upload new files)
userpersonalrouter.put(
  "/updateresume/:id",
  protect, // run auth check first
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  updateResume
);

// ✅ Delete resume
userpersonalrouter.delete("/deleteresume/:id", protect, deleteResume);

module.exports = userpersonalrouter;
