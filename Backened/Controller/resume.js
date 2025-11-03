const Personalresume = require("../mongo/userpersonal/userresume");

// ✅ POST Resume (upload + save)
const postresume = async (req, res) => {
  try {
    const {
      name,
      mobilenumber,
      email,
      address,
      education,
      experience,
      skills,
      hoobys,
      title,
      summary,
    } = req.body;

    const resumeFile = req.files?.resume?.[0];
    const imageFile = req.files?.image?.[0];

    // Convert files to Base64 strings if provided
    const resumeBase64 = resumeFile ? resumeFile.buffer.toString("base64") : null;
    const imageBase64 = imageFile ? imageFile.buffer.toString("base64") : null;

    // Create a new resume entry
    const newResume = new Personalresume({
      user: req.user._id,
      name,
      mobilenumber,
      email,
      address,
      education,
      experience,
      skills,
      hoobys,
      title,
      summary,
      image: imageBase64,
      resumeData: resumeBase64,
      resumeFileType: resumeFile?.mimetype || "application/pdf",
    });

    await newResume.save();

    res.status(201).json({
      success: true,
      message: "✅ Resume created successfully",
      resume: newResume,
    });
  } catch (error) {
    console.error("❌ Error creating resume:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ GET all resumes for logged-in user
const getResume = async (req, res) => {
  try {
    const resumes = await Personalresume.find({ user: req.user._id });

    if (!resumes || resumes.length === 0) {
      return res.status(404).json({ message: "No resume found" });
    }

    // Format resume data for frontend (Base64-encoded URLs)
    const formattedResumes = resumes.map((resume) => ({
      ...resume._doc,
      image: resume.image
        ? `data:image/jpeg;base64,${resume.image}`
        : null,
      resumeLink:
        resume.resumeData && resume.resumeFileType
          ? `data:${resume.resumeFileType};base64,${resume.resumeData}`
          : null,
    }));

    res.status(200).json({ success: true, resumes: formattedResumes });
  } catch (error) {
    console.error("❌ Error fetching resumes:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ UPDATE Resume
const updateResume = async (req, res) => {
  try {
    const resumeId = req.params.id;
    const existingResume = await Personalresume.findById(resumeId);

    if (!existingResume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const {
      name,
      mobilenumber,
      email,
      address,
      education,
      experience,
      skills,
      hoobys,
      title,
      summary,
    } = req.body;

    const resumeFile = req.files?.resume?.[0];
    const imageFile = req.files?.image?.[0];

    // Update fields
    if (resumeFile) {
      existingResume.resumeData = resumeFile.buffer.toString("base64");
      existingResume.resumeFileType = resumeFile.mimetype;
    }
    if (imageFile) {
      existingResume.image = imageFile.buffer.toString("base64");
    }

    existingResume.name = name ?? existingResume.name;
    existingResume.mobilenumber = mobilenumber ?? existingResume.mobilenumber;
    existingResume.email = email ?? existingResume.email;
    existingResume.address = address ?? existingResume.address;
    existingResume.education = education ?? existingResume.education;
    existingResume.experience = experience ?? existingResume.experience;
    existingResume.skills = skills ?? existingResume.skills;
    existingResume.hoobys = hoobys ?? existingResume.hoobys;
    existingResume.title = title ?? existingResume.title;
    existingResume.summary = summary ?? existingResume.summary;

    const updatedResume = await existingResume.save();

    res.status(200).json({
      success: true,
      message: "✅ Resume updated successfully",
      resume: updatedResume,
    });
  } catch (error) {
    console.error("❌ Error updating resume:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ DELETE Resume
const deleteResume = async (req, res) => {
  try {
    const resumeId = req.params.id;
    const deletedResume = await Personalresume.findByIdAndDelete(resumeId);

    if (!deletedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({
      success: true,
      message: "✅ Resume deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting resume:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  postresume,
  getResume,
  updateResume,
  deleteResume,
};
