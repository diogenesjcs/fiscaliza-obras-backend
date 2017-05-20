const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  images: Array,
  createdBy: String,
  impact: Number,
  constructionSite: String,
  description: String,
  supportedBy: Array,
  comments: Array
}, { timestamps: true });

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
