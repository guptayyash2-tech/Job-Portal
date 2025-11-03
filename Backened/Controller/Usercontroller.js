const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../mongo/Userlogin/user");
const employerjoblisting = require("../mongo/adminlogin/employerjoblisting");

// 🔹 Generate JWT
const generateToken = (userId, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: "25d",
  });
};

// 🔹 Register User
const register = async (req, res, next) => {
  try {
    const { username, emailid, password, mobilenumber } = req.body;
    const userImage = req.file ? req.file.buffer.toString("base64") : null;

    const existingUser = await User.findOne({ emailid });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    if (!password || password.length < 8)
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      emailid,
      mobilenumber,
      password: hashedPassword,
      image: userImage,
    });

    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      user: {
        id: newUser._id,
        username: newUser.username,
        emailid: newUser.emailid,
        mobilenumber: newUser.mobilenumber,
        image: newUser.image,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Error in register:", error);
    next(error);
  }
};

// 🔹 Login User
const login = async (req, res, next) => {
  try {
    const { emailid, password } = req.body;
    const user = await User.findOne({ emailid });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        emailid: user.emailid,
        mobilenumber: user.mobilenumber,
        image: user.image,
      },
      role: user.role,
      token,
    });
  } catch (error) {
    console.error("❌ Error in login:", error);
    next(error);
  }
};

// 🔹 Get User Profile
const getuserprofile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    next(error);
  }
};

// 🔹 Update User Profile
const updateuserprofile = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No user ID found" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { username, emailid, mobilenumber } = req.body;
    const userImage = req.file ? req.file.buffer.toString("base64") : null;

    if (username) user.username = username;
    if (emailid) user.emailid = emailid;
    if (mobilenumber) user.mobilenumber = mobilenumber;
    if (userImage) user.image = userImage;

    await user.save();

    const updatedUser = await User.findById(req.user.id).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
      error: error.message,
    });
  }
};

// 🔹 Get All Jobs
const getjoblist = async (req, res, next) => {
  try {
    const jobs = await employerjoblisting.find();
    res.json({ jobs });
  } catch (error) {
    console.error("❌ Error fetching jobs:", error);
    next(error);
  }
};

// 🔹 Get Job By ID
const getjobbyid = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const job = await employerjoblisting.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ job });
  } catch (error) {
    console.error("❌ Error fetching job by ID:", error);
    next(error);
  }
};

// ✅ Export all functions (CommonJS)
module.exports = {
  register,
  login,
  getuserprofile,
  updateuserprofile,
  getjoblist,
  getjobbyid,
};
