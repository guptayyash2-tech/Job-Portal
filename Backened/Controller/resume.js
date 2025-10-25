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
      summary
    } = req.body;

    // ✅ Handle file uploads safely
    const resumeFile = req.files?.resume?.[0];
    const imageFile = req.files?.image?.[0];

    const resumeBase64 = resumeFile
      ? resumeFile.buffer.toString("base64")
      : null;
    const imageBase64 = imageFile ? imageFile.buffer.toString("base64") : null;

    // ✅ Create resume document
    const newResume = new Personalresume({
      user: req.user._id,
      resumeLink: resumeBase64, // store resume as base64
      image: imageBase64,       // store image as base64
      name,
      mobilenumber,
      email,
      address,
      education,
      experience,
      skills,
      hoobys,
      title,
      summary
    });

    await newResume.save();

    res
      .status(201)
      .json({ message: "✅ Resume created successfully", resume: newResume });
  } catch (error) {
    console.error("❌ Error creating resume:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ GET all resumes for logged-in user
const getResume = async (req, res) => {
  try {
    const resumes = await Personalresume.find({ user: req.user._id });
    
    const formattedResumes = resumes.map((resume) => ({
      ...resume._doc,
      image: resume.image ? `data:image/jpeg;base64,${resume.image}` : null,
      resumeLink: resume.resumeLink ? `data:application/pdf;base64,${resume.resumeLink}` : null,
    }));

    res.status(200).json({ resumes: formattedResumes });
  } catch (error) {
    console.error("❌ Error fetching resumes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateResume = async (req, res) => {
  try {
    const resumeId = req.params.id;
    const updateData = req.body;
    const updatedResume = await Personalresume.findByIdAndUpdate(
      resumeId,
      updateData,
      { new: true }
    );
    if (!updatedResume) {
      return res.status(404).json({ message: "Resume not found" });
    } 
    res
      .status(200)
      .json({ message: "Resume updated successfully", resume: updatedResume });
  }
  catch (error) {
    console.error("❌ Error updating resume:", error);
    res.status(500).json({ message: "Internal server error" });
  }     
  
  };
  const deleteResume = async (req, res) => {
    try {
      const resumeId = req.params.id;
      const deletedResume = await Personalresume.findByIdAndDelete(resumeId);   
      if (!deletedResume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      res
        .status(200)
        .json({ message: "Resume deleted successfully" });
    } catch (error) {
      console.error("❌ Error deleting resume:", error);
      res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { postresume, getResume, updateResume, deleteResume };
