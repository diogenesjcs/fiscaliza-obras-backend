const passport = require('passport');
const Complaint = require('../models/Complaint');
const ConstructionSite = require('../models/ConstructionSite');
const User = require('../models/User');

exports.postAddComplaint = (req, res, next) => {
  const coords = [];
  coords[0] = req.body.lng;
  coords[1] = req.body.lat;
  User.findOne(
    {
      email: req.body.email
    },
    (err, user) => {
      if (err) {
        return next(err);
      }
      ConstructionSite.findOne(
        {
          _id: req.body.constructionSiteId
        },
        (err2, constructionSite) => {
          if (err2) {
            return next(err);
          }
          if (constructionSite.complaints !== null) constructionSite.complaints++;
          else constructionSite.complaints = 1;

          constructionSite.save();
          const complaint = new Complaint({
            lat: coords[1],
            lng: coords[0],
            createdBy: user._id,
            impact: req.body.impact,
            images: [],
            constructionSite: constructionSite._id
          });
          complaint.save();
          res.send(complaint);
        }
      );
    }
  );
};

exports.getConstructionSites = (req, res) => {
  ConstructionSite.find({}, (err, constructionSites) => {
    if (err) {
      return err;
    }
    const constructionSitesMap = [];
    constructionSites.forEach((constructionSite) => {
      constructionSitesMap.push(constructionSite);
    });
    res.send(constructionSitesMap);
  });
};

exports.getComplaints = (req, res) => {
  Complaint.find({}, (err, complaints) => {
    if (err) {
      return err;
    }
    const complaintsMap = [];

    complaints.forEach((complaint) => {
      complaintsMap.push(complaint);
    });
    res.send(complaintsMap);
  });
};
