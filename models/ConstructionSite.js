const mongoose = require('mongoose');
const Location = require('../models/Location');

const constructionSiteSchema = new mongoose.Schema({
    complaints: Number,
    radius: Number,
    location: String,
    investment: Number,
    selectionDate: Date,
    conclusionDate: Date,
    UF: String,
    city: String,
    department: String,
    executioner: String,
    title: String,
    type: String,
    state: String,
    cycleDate: Date
}, {
    timestamps: true
});

const ConstructionSite = mongoose.model('ConstructionSite', constructionSiteSchema);

module.exports = ConstructionSite;
