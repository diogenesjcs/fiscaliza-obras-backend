const xlsx = require('node-xlsx');
const fs = require('fs');
const mongoose = require('mongoose');
const ConstructionSite = require('../models/ConstructionSite');
const Location = require('../models/Location');
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

const workSheets = xlsx.parse(fs.readFileSync(`${__dirname}/Obras.xlsx`));

const table = workSheets[0].data;
const description = workSheets[1].data;
const types = workSheets[2].data;
const states = workSheets[3].data;
//console.log(table);

_.forEach(table, (cs, index) => {
    if (index == 0)
        return;
    let type = _.find(types, (type) => {
        return type[0] === cs[1];
    });
    cs[1] = type;
    let state = _.find(states, (state) => {
        return state[0] === cs[8];
    });
    cs[8] = state;
    cs[9] = new Date(1899, 12, cs[9] - 1);
    cs[10] = new Date(1899, 12, cs[10] - 1);
    cs[12] = geo.parseDMS(cs[12]);
    cs[13] = geo.parseDMS(cs[13]);
    console.log(cs[9],cs[10]);
    var coords = [];
    coords[0] = cs[12];
    coords[1] = cs[13];
    var query = {
            lat: coords[0],
            lng: coords[1]
        },
        update = {
            expire: new Date()
        },
        options = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        };
    Location.findOneAndUpdate(query, update, options, function(error, location) {
        if (error) return next(err);
        const constructionSite = new ConstructionSite({
            complaints: 0,
            radius: 0,
            location: location._id,
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
            stateDescrption:cs[8][2],
            cycleDate: cs[10]
        });
        constructionSite.save();
    });

});
