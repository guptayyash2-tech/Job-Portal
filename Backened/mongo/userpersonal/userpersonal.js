const mongoose = require("mongoose");

const userPersonalInformationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ reference to the User model
      required: true,
    },
    address: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 100,
    },
    pincode: {
      type: String,
      required: true,
      match: [/^[0-9]{6}$/, "Invalid pincode format"],
    },
    mobilenumber1: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, "Invalid mobile number format"],
    },
    mobilenumber2: {
      type: String,
      match: [/^[0-9]{10}$/, "Invalid mobile number format"],
    },
    city: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "UserPersonalInformation",
  userPersonalInformationSchema
);
