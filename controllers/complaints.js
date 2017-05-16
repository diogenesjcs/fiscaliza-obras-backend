'use strict';
const passport = require('passport');
const Complaint = require('../models/Complaint');
const Location = require('../models/Location');
const ConstructionSite = require('../models/ConstructionSite');
const User = require('../models/User');

exports.postAddComplaint = (req, res, next) => {
    var coords = [];
    coords[0] = req.body.lng;
    coords[1] = req.body.lat;
    var query = {
            lat: coords[1],
            lng: coords[2]
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
        User.findOne({
            email: req.body.email
        }, (err, user) => {
            if (err) {
                return next(err);
            }
            ConstructionSite.findOne({
                email: req.body.constructionSiteId
            }, (err2, constructionSite) => {
                if (err2) {
                    return next(err);
                }
                constructionSite.complaints += 1;
                constructionSite.save();
                const complaint = new Complaint({
                    location: location._id,
                    createdBy: user._id,
                    impact: 0,
                    images: [],
                    constructionSite: constructionSite._id
                });
                complaint.save();
            });
        });
    });

};

exports.getConstructionSites = (req, res) => {
    ConstructionSite.find({}, function(err, constructionSites) {
        if (err) {
            return next(err);
        }
        var constructionSitesMap = {};

        constructionSites.forEach(function(constructionSite) {
            constructionSitesMap.push(constructionSite);
        });
        res.send(constructionSitesMap);
    });
};

exports.getComplaints = (req, res) => {
    Complaint.find({}, function(err, complaints) {
        if (err) {
            return next(err);
        }
        var complaintsMap = {};

        complaints.forEach(function(complaint) {
            complaintsMap.push(complaint);
        });
        res.send(complaintsMap);
    });
};
