const mongoose = require('mongoose');

// Define the schema
const adminregister = new mongoose.Schema({
pancard: {
  type: String,
  required: true,
  unique: true, // PAN should be unique
  uppercase: true, // convert input to uppercase
  match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN card format']
},
  officeemailid: {
    type: String,
    required: true,
    unique: true,          
    lowercase: true,       
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'] 
  },
  mobilenumber: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, 'Invalid mobile number format'] 
  },
  password: {
    type: String,
    required: true,
    minlength: 8           
  },
  userImage: {
    type: String,
    required: true
  },
  role: { type: String, enum: ["user", "admin"], default: "admin" }, // ✅ Add this line
}, { timestamps: true });

// Export model
module.exports = mongoose.model('Admin', adminregister);
