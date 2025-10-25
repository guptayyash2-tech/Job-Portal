const express = require('express');
const { default: mongoose } = require('mongoose');

const Personalresume = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    summary: {
      type: String,
      required: true
    },
    resumeLink: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    mobilenumber: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    education: {
      type: String,
      required: true      
    },
    experience: {
      type: String,
      required: true    
    },
    skills: {
      type: String,
      required: true    
    },
    hoobys: {
      type: String,
      required: true    
    },

  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Personalresume", Personalresume);
