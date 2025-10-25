const mongoose = require("mongoose");

const employerProfileSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // reference to the employer account
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
    },
    companyEmail: {
      type: String,
      required: true,
      match: [/.+@.+\..+/, "Invalid email format"],
    },
    companyPhone: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, "Invalid phone number format"],
    },
    website: {
      type: String,
      match: [/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,4}\/?$/, "Invalid URL format"],
    },
    address: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 200,
    },
    city: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
      match: [/^[0-9]{6}$/, "Invalid pincode format"],
    },
    contactPersonName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    contactPersonEmail: {
      type: String,
      required: true,
      match: [/.+@.+\..+/, "Invalid email format"],
    },
    contactPersonPhone: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, "Invalid phone number format"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmployerProfile", employerProfileSchema);
