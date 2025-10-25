const companyinformation = require("../mongo/adminlogin/company");
const createCompanyInformation = async (req, res) => {
  try {
    const {
      companyName,
      companyEmail,
      companyPhone,
      website,
      address,
      city,
      pincode,
      contactPersonName,
      contactPersonEmail,
      contactPersonPhone
    } = req.body;

    // Validation
    if (!companyName || !companyEmail) {
      return res.status(400).json({ message: "Company name and email are required" });
    }

    // Check if company info already exists for this admin
    const existingCompany = await companyinformation.findOne({ admin: req.admin._id });
    if (existingCompany) {
      return res.status(400).json({ message: "Company information already exists" });
    }

    const companyInfo = new companyinformation({
      admin: req.admin._id,
      companyName,
      companyEmail,
      companyPhone,
      website,
      address,
      city,
      pincode,
      contactPersonName,
      contactPersonEmail,
      contactPersonPhone
    });

    await companyInfo.save();
    res.status(201).json({ success: true, company: companyInfo });

  } catch (error) {
    console.error("Error creating company information:", error.message);
    res.status(500).json({ message: "Error creating company information" });
  }
};

const getCompanyInformation = async (req, res) => {
  try {
    const companyInfo = await companyinformation.findOne({ admin: req.admin._id });
    if (!companyInfo) {
      return res.status(404).json({ message: "Company information not found" });
    }

    res.status(200).json({ success: true, company: companyInfo });
  } catch (error) {
    console.error("Error fetching company information:", error.message);
    res.status(500).json({ message: "Error fetching company information" });
  }
};
const updateCompanyInformation = async (req, res) => {
  try {
    const companyInfo = await companyinformation.findOne({ admin: req.admin._id });
    if (!companyInfo) {
      return res.status(404).json({ message: "Company information not found" });
    }
    const updates = req.body;
    Object.keys(updates).forEach((key) => {
      companyInfo[key] = updates[key];
    });
    await companyInfo.save();
    res.status(200).json({ success: true, company: companyInfo });
  } catch (error) {
    console.error("Error updating company information:", error.message);
    res.status(500).json({ message: "Error updating company information" });
  }
};


module.exports = {
  createCompanyInformation,
  getCompanyInformation,
  updateCompanyInformation
};
