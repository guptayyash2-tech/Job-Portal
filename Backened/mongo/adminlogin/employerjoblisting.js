const mongoose = require("mongoose");

const employerJobListingSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // reference to the employer account
      required: true,
    },
    
    jobTitle: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
    },
  description: {
      type: String,
      required: true,   
        minlength: 10,
        maxlength: 1000,
    },
  
    totalVacancies: {
        type: Number,
        default: 0,
    },
    location: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 200,
    },
    
    qualifications: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 1000,
    },
   
   responsibilities: {
      type: String,
      required: true,
        minlength: 10,
        maxlength: 1000,
    },
    salaryRange: {  
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmployerJobListing", employerJobListingSchema);
