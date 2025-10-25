const UserPersonalInformation = require("../mongo/userpersonal/userpersonal");

// ✅ Save or update personal info
const savePersonalInfo = async (req, res) => {
  try {
    const { address, pincode, city, mobilenumber1, mobilenumber2 } = req.body;

    let userInfo = await UserPersonalInformation.findOne({ user: req.user._id });

    if (userInfo) {
      userInfo.address = address;
      userInfo.pincode = pincode;
      userInfo.city = city;
      userInfo.mobilenumber1 = mobilenumber1;
      userInfo.mobilenumber2 = mobilenumber2;
      await userInfo.save();
      return res.status(200).json({ message: "Personal info updated", userInfo });
    }

    userInfo = await UserPersonalInformation.create({
      user: req.user._id,
      address,
      pincode,
      city,
      mobilenumber1,
      mobilenumber2,
    });

    res.status(201).json({ message: "Personal info saved", userInfo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get personal info
const getPersonalInfo = async (req, res) => {
  try {
    const userInfo = await UserPersonalInformation.findOne({ user: req.user._id }).populate(
      "user",
      "username emailid mobilenumber"
    );

    if (!userInfo) {
      return res.status(404).json({ message: "Personal info not found" });
    }

    // Wrap in 'user' key for frontend consistency
    res.status(200).json({ user: userInfo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update personal info
const updatePersonalInfo = async (req, res, next) => {
  try {
    const userInfo = await UserPersonalInformation.findOne({ user: req.user._id });
    if (!userInfo) return res.status(404).json({ message: "Personal info not found" });

    const { address, pincode, city, mobilenumber1, mobilenumber2 } = req.body;

    userInfo.address = address || userInfo.address;
    userInfo.pincode = pincode || userInfo.pincode;
    userInfo.city = city || userInfo.city;
    userInfo.mobilenumber1 = mobilenumber1 || userInfo.mobilenumber1;
    userInfo.mobilenumber2 = mobilenumber2 || userInfo.mobilenumber2;

    await userInfo.save();
    res.status(200).json({ message: "Personal info updated", user: userInfo });
  } catch (error) {
    next(error);
  }
};

module.exports = { savePersonalInfo, getPersonalInfo, updatePersonalInfo };
