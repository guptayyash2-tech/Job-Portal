const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../mongo/Userlogin/user");
const employerjoblisting = require("../mongo/adminlogin/employerjoblisting");
// Generate JWT
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ id: userId, role: User.role }, process.env.JWT_SECRET, { expiresIn: "25d" });
};

// Register
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

    const token = generateToken(newUser._id);
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
    next(error);
  }
};

// Login
const login = async (req, res, next) => {
  try {
    const { emailid, password } = req.body;
    const user = await User.findOne({ emailid });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        emailid: user.emailid,
        mobilenumber: user.mobilenumber,
        image: user.image,
      },
      token,
          role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

// Get user profile
const getuserprofile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

// Update profile
const updateuserprofile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { username, emailid, mobilenumber } = req.body;
    user.username = username || user.username;
    user.emailid = emailid || user.emailid;
    user.mobilenumber = mobilenumber || user.mobilenumber;

    await user.save();
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

const getjoblist = async (req, res, next) => {
  try {
    const jobs = await employerjoblisting.find();
   
    res.json({ jobs });
  } catch (error) {
    next(error);
  }
};
const getjobbyid = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const job = await employerjoblisting.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ job });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getuserprofile, updateuserprofile, getjoblist, getjobbyid };
