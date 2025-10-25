const employerjoblisting = require("../mongo/adminlogin/employerjoblisting");

const createJobListing = async (req, res) => {
  try {
    const {
      jobTitle,
      description,
      totalVacancies,
      location,
      qualifications,
      responsibilities,
      salaryRange
    } = req.body;

    // ✅ Validation
    if (!jobTitle || !description || !location || !qualifications || !responsibilities || !salaryRange) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Create new job listing
    const jobListing = new employerjoblisting({
      admin: req.admin._id,   // Links job to the logged-in admin
      jobTitle,
      description,
      totalVacancies,
      location,
      qualifications,
      responsibilities,
      salaryRange
    });

    // ✅ Save to MongoDB
    await jobListing.save();

    // ✅ Success response
    res.status(201).json({ success: true, job: jobListing });

  } catch (error) {
    console.error("Error creating job listing:", error.message);
    res.status(500).json({ message: "Error creating job listing" });
  }
};

const getJobListings = async (req, res) => {
  try {
    const jobListings = await employerjoblisting.find({ admin: req.admin._id });
    res.status(200).json({ success: true, jobs: jobListings });
  } catch (error) {
    console.error("Error fetching job listings:", error.message);
    res.status(500).json({ message: "Error fetching job listings" });
  }
};
const deleteJobListing = async (req, res) => {
  try {
    const { id } = req.params;
    const jobListing = await employerjoblisting.findOneAndDelete({ _id: id, admin: req.admin._id });

    if (!jobListing) {
      return res.status(404).json({ message: "Job listing not found" });
    }

    res.status(200).json({ success: true, message: "Job listing deleted successfully" });
  } catch (error) {
    console.error("Error deleting job listing:", error.message);
    res.status(500).json({ message: "Error deleting job listing" });
  }
};

module.exports = { createJobListing, getJobListings, deleteJobListing };
