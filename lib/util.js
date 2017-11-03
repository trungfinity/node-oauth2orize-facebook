'use strict';
require('dotenv');
var request = require('request');
var crypto = require('crypto');

exports.getFacebookProfile = function (fields, accessToken, cb) {
  var appSecretProof = crypto.createHmac('sha256', process.env.FB_APP_SECRET).update(accessToken).digest('hex');
  var fieldsString = fields.join();

  request({
    url: 'https://graph.facebook.com/me?fields=' + fieldsString + '&access_token=' + accessToken + '&appsecret_proof=' + appSecretProof,
    json: true
  },
  function (err, res, body) {
    if (err) {
      return cb(err);
    }

    if (body && body.error) {
      var msg = body.error.message || 'Could not get Facebook profile.';
      return cb(new Error(msg));
    }

    cb(null, body);
  });
};
