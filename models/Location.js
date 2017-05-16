const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    lat: Number,
    lng: Number
});

const Location = mongoose.model('Location', LocationSchema);

module.exports = Location;
