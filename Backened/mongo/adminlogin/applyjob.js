const mongoose = require('mongoose');

// Define the schema
const applyJobSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // Reference to the employer account
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the applicant
      required: true,
    },
     jobListing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployerJobListing", // ✅ must match exactly
      required: true,
    },
    resume: {
      type: String,
      data: String, // URL or file path to the resume
    },
      status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Export model
module.exports = mongoose.model('ApplyJob', applyJobSchema);
