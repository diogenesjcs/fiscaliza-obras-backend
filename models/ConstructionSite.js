const mongoose = require('mongoose');

const constructionSiteSchema = new mongoose.Schema(
  {
    complaints: Number,
    radius: Number,
    lat: Number,
    lng: Number,
    investment: Number,
    selectionDate: Date,
    conclusionDate: Date,
    UF: String,
    city: String,
    department: String,
    executioner: String,
    title: String,
    typeId: String,
    type: String,
    stateId: String,
    state: String,
    stateDescrption: String,
    cycleDate: Date
  },
  {
    timestamps: true
  }
);

const ConstructionSite = mongoose.model('ConstructionSite', constructionSiteSchema);

module.exports = ConstructionSite;
