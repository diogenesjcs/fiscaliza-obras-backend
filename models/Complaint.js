const mongoose = require('mongoose');
const Location = require('../models/Location');
const ConstructionSite = require('../models/ConstructionSite');

const complaintSchema = new mongoose.Schema({
  location: String,
  images: Array,
  createdBy: String,
  impact: Number,
  constructionSite: String
}, { timestamps: true });

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
