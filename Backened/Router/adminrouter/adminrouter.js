const express = require("express");
const multer = require("multer");
const adminRouter = express.Router();
const {
  adminregister,
  adminlogin,
  getadminprofile,
  updateadminprofile,
} = require("../../Controller/admincontroller");
const adminprotect = require("../../middlewear/adminmiddile");
const { createCompanyInformation, getCompanyInformation, updateCompanyInformation } = require("../../Controller/comapnycontroller");
const { createJobListing, getJobListings, deleteJobListing } = require("../../Controller/employerjoblistingcontroller");
const {  getAllApplicationsByAdmin, approveApplication, rejectApplication } = require("../../Controller/apllyjob/applyjob");



// Configure multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
adminRouter.post("/adminregister", upload.single("userImage"), adminregister);
adminRouter.post("/adminlogin", adminlogin);
adminRouter.get("/admingetprofile", adminprotect, getadminprofile);
adminRouter.put("/adminupdateprofile", adminprotect,upload.single("userImage"), updateadminprofile);


adminRouter.post("/companycreate", adminprotect, createCompanyInformation);
adminRouter.get("/getcompanyinfo", adminprotect, getCompanyInformation);
adminRouter.post("/createjoblisting", adminprotect, createJobListing);
adminRouter.get("/getjoblistings", adminprotect, getJobListings);
adminRouter.put("/updatecompanyinfo", adminprotect, updateCompanyInformation);
adminRouter.post("/getapplyjob", adminprotect, getAllApplicationsByAdmin);
adminRouter.delete("/deletejoblisting/:id", adminprotect, deleteJobListing);
adminRouter.get("/getjobapplications", adminprotect, getAllApplicationsByAdmin);
adminRouter.put("/approveapplication/:id", adminprotect, approveApplication);
adminRouter.put("/rejectapplication/:id", adminprotect, rejectApplication);
module.exports = adminRouter;
