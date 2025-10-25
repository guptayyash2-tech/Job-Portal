const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const admin = require("../mongo/adminlogin/admin");

// Function to generate JWT
const generateToken = (adminId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ id: adminId, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "25d" });
};

// @desc    Register admin
const adminregister = async (req, res, next) => {
  try {
    const { pancard, officeemailid, password, mobilenumber } = req.body;
     const userImage = req.file ? req.file.buffer.toString("base64") : null;

    // Check if admin already exists
    const existingAdmin = await admin.findOne({ officeemailid });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Check password length
    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const newAdmin = await admin.create({
      pancard,
      officeemailid,
      mobilenumber,
      password: hashedPassword,
      userImage
    });

    // Generate JWT token
    const token = generateToken(newAdmin._id);

    // Send response
    res.status(201).json({
      user: { id: newAdmin._id, pancard: newAdmin.pancard, officeemailid: newAdmin.officeemailid, mobilenumber: newAdmin.mobilenumber, userImage: newAdmin.userImage },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
const Admin = require("../mongo/adminlogin/admin"); // Capitalize model

const adminlogin = async (req, res, next) => {
  try {
    const { officeemailid, password } = req.body;

    // Use a different name for the found admin
    const foundAdmin = await Admin.findOne({ officeemailid });
    if (!foundAdmin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, foundAdmin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = generateToken(foundAdmin._id);

    res.status(200).json({
      admin: {
        id: foundAdmin._id,
        pancard: foundAdmin.pancard,
        officeemailid: foundAdmin.officeemailid,
        mobilenumber: foundAdmin.mobilenumber,
        userImage: foundAdmin.userImage,
      },
      token,
      role: foundAdmin.role
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Get admin profile
const getadminprofile = async (req, res, next) => {
  try {
    const adminget = await admin.findById(req.admin.id).select("-password");
    if (!adminget) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(adminget);
  } catch (error) {
    next(error);
  }
};
const updateadminprofile = async (req, res, next) => {
  try {
    const adminToUpdate = await admin.findById(req.admin.id);
    if (!adminToUpdate) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const { pancard, officeemailid, mobilenumber } = req.body;
    adminToUpdate.pancard = pancard || adminToUpdate.pancard;
    adminToUpdate.officeemailid = officeemailid || adminToUpdate.officeemailid;
    adminToUpdate.mobilenumber = mobilenumber || adminToUpdate.mobilenumber;

    await adminToUpdate.save();
    res.json(adminToUpdate);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  adminregister,
  adminlogin,
  getadminprofile,
  updateadminprofile,
};
