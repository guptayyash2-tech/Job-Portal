const employerjoblisting = require("../../mongo/adminlogin/employerjoblisting");
const ApplyJob = require("../../mongo/adminlogin/applyjob");

// 📝 Apply for a Job (no resume required)
const applyForJob = async (req, res) => {
  const { resume } = req.body;
  const resumefiles = req.file ? req.file.buffer.toString("base64") : null;
  try {
    const userId = req.user?._id;
    const { jobId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. Please log in first." });
    }

    const job = await employerjoblisting.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    const alreadyApplied = await ApplyJob.findOne({
      user: userId,
      jobListing: jobId,
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied for this job." });
    }

    const newApplication = new ApplyJob({
      user: userId,
      jobListing: jobId,
      admin: job.admin,
      resume: resumefiles,
      appliedAt: new Date(),
    });

    await newApplication.save();

    res.status(201).json({
      success: true,
      message: "✅ Application submitted successfully!",
      application: newApplication,
    });
  } catch (error) {
    console.error("❌ Error applying for job:", error.message);
    res.status(500).json({ message: "Internal server error while applying for job." });
  }
};

// 📄 Get All Applications (for Admin)
const getAllApplicationsByAdmin = async (req, res) => {
  try {
    const applications = await ApplyJob.find({ admin: req.admin._id })
      .populate("user", "username emailid") // ✅ get user name + email
      .populate("jobListing", "jobTitle location"); // ✅ get job title + location

    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error("❌ Error fetching applications:", error.message);
    res.status(500).json({ message: "Error fetching applications" });
  }
};


// 👤 Get Applications by User
const getUserApplications = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. Please log in first." });
    }

    const applications = await ApplyJob.find({ user: userId })
      .populate("jobListing", "jobTitle location")
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("❌ Error fetching user applications:", error.message);
    res.status(500).json({ message: "Error fetching your job applications." });
  }
};

// approve application
const approveApplication = async (req, res) => {
  try {
    const app = await ApplyJob.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// reject application
const rejectApplication = async (req, res) => {
  try {
    const app = await ApplyJob.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



module.exports = {
  applyForJob,
  getAllApplicationsByAdmin,
  getUserApplications,
  approveApplication,
  rejectApplication,
};
