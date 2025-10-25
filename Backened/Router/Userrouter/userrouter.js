const express = require("express");
const router = express.Router();
const multer = require("multer");
const { getuserprofile, login, register, updateuserprofile, getjoblist, getjobbyid } = require("../../Controller/Usercontroller");
const protect = require("../../middlewear/usermiddle");
const { applyForJob } = require("../../Controller/apllyjob/applyjob");


// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.post("/register", upload.single("image"), register);
router.post("/login", login);
router.get("/usergetprofile", protect, getuserprofile);
router.put("/userupdateprofile", protect, updateuserprofile);
router.get("/joblistings", protect, getjoblist);

router.post("/applyjob/:jobId", protect, upload.single("resume"), applyForJob);
router.get("/job/:jobId", protect, getjobbyid);

module.exports = router;
