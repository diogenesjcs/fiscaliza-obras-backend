const passport = require('passport');
const Complaint = require('../models/Complaint');
const ConstructionSite = require('../models/ConstructionSite');
const User = require('../models/User');
const Promise = require('bluebird');
const _ = require('lodash');
const fs = require('fs');
const uuidV4 = require('uuid/v4');
const path = require('path');
const resolve = path.resolve;

exports.postAddComplaint = (req, res, next) => {
  const coords = [];
  coords[0] = req.body.lng;
  coords[1] = req.body.lat;
  User.findOne({
    email: req.body.email
  },
    (err, user) => {
      if (err) {
        return next(err);
      }
      ConstructionSite.findOne({
        _id: req.body.constructionSiteId
      },
        (err2, constructionSite) => {
          if (err2) {
            return next(err);
          }
          constructionSite.complaints += 1;
          constructionSite.save();
          const imagesId = [];
          _.forEach(JSON.parse(req.body.images), (image) => {
            imagesId.push(uuidV4());
          });
          _.forEach(JSON.parse(req.body.images), (image, index) => {
            const base64Data = image.replace(/^data:image\/jpeg;base64,/, '');
            const pathUpload = `${`${resolve('public/imgs')}/${imagesId[index]}`}.jpg`;
            fs.writeFile(pathUpload, base64Data, 'base64', (err) => {
              console.log(err);
            });
          });
          const complaint = new Complaint({
            lat: coords[1],
            lng: coords[0],
            createdBy: user._id,
            impact: req.body.impact,
            images: imagesId,
            description: req.body.description,
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
  if (req.query.email) {
    User.findOne({
      email: req.query.email
    },
      (err, user) => {
        if (err) {
          return err;
        }
        Complaint.find({ createdBy: user._id }, (err, complaints) => {
          if (err) {
            return err;
          }
          const complaintsResult = _.map(complaints, (comp) => {
            const model = {
              email: null,
              profile: null,
              _id: null
            };
            const userResult = _.pick(user, _.keys(model));
            const c = JSON.parse(JSON.stringify(comp));
            c.createdBy = userResult;
            return c;
          });
          res.send(complaintsResult);
        });
      }
    );
  } else {
    Complaint.find({}, (err, complaints) => {
      if (err) {
        return err;
      }
      const complaintsMap = [];
      const users = [];

      complaints.forEach((complaint) => {
        complaintsMap.push(complaint);
        users.push(User.findOne({ _id: complaint.createdBy }).exec());
      });
      Promise.all(users).then((resultUsers) => {
        const complaintsResult = _.map(complaintsMap, (comp) => {
          const model = {
            email: null,
            profile: null,
            _id: null
          };
          const user = _.pick(_.find(resultUsers, u => (u._id.toString() === comp.createdBy)), _.keys(model));
          const c = JSON.parse(JSON.stringify(comp));
          c.createdBy = user;
          return c;
        });
        res.send(complaintsResult);
      });
    });
  }
};
