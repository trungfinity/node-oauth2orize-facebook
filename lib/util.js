'use strict';

var request = require('request');

exports.getFacebookProfile = function (accessToken, cb) {
  request({
    url: 'https://graph.facebook.com/me?access_token=' + accessToken,
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
