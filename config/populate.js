const xlsx = require('node-xlsx');
const fs = require('fs');
const mongoose = require('mongoose');
const ConstructionSite = require('../models/ConstructionSite');
const _ = require('lodash');
const geo = require('mt-geo');
const dotenv = require('dotenv');

dotenv.load({ path: '../.env' });

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});

const ConvertDMSToDD = (degrees, minutes, seconds, direction) => {
  let dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60);
  console.log(degrees, minutes, seconds, direction);
  if (direction == 'S' || direction == 'O') {
    dd *= -1;
  } // Don't do anything for N or E
  return dd;
};

const ParseDMS = (lat2, lng2) => {
  let parts = lat2.toString().split(/[^\d\w]+/);
  parts[3] = lat2.toString().substring(lat2.toString().length - 1, lat2.toString().length);
  const lat = ConvertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
  parts = lng2.toString().split(/[^\d\w]+/);
  parts[3] = lng2.toString().substring(lng2.toString().length - 1, lng2.toString().length);
  const lng = ConvertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
  return [lat, lng];
};

const workSheets = xlsx.parse(fs.readFileSync(`${__dirname}/Obras.xlsx`));

const table = workSheets[0].data;
const description = workSheets[1].data;
const types = workSheets[2].data;
const states = workSheets[3].data;
// console.log(table);

_.forEach(table, (cs, index) => {
  if (index === 0) return;
  const type = _.find(types, type => type[0] === cs[1]);
  cs[1] = type;
  const state = _.find(states, state => state[0] === cs[8]);
  cs[8] = state;
  cs[9] = new Date(1899, 12, cs[9] - 1);
  cs[10] = new Date(1899, 12, cs[10] - 1);
  cs[12] = ParseDMS(cs[12], cs[13])[0];
  cs[13] = ParseDMS(cs[12], cs[13])[1];
  console.log(cs[12], cs[13]);
  const coords = [];
  coords[0] = cs[12];
  coords[1] = cs[13];
  const query = {
    lat: coords[0],
    lng: coords[1]
  };
  const update = {
    expire: new Date()
  };
  const options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  };
  const constructionSite = new ConstructionSite({
    complaints: 0,
    radius: 0,
    lat: coords[0],
    lng: coords[1],
    investment: cs[3],
    selectionDate: cs[9],
    UF: cs[4],
    city: cs[5],
    department: cs[7],
    executioner: cs[6],
    title: cs[2],
    typeId: cs[1][0],
    type: cs[1][1],
    stateId: cs[8][0],
    state: cs[8][1],
    stateDescrption: cs[8][2],
    cycleDate: cs[10]
  });
  constructionSite.save();
});
