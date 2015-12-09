'use strict';

var request = require('request');

exports.getFacebookProfile = function (accessToken, requiredScopes, cb) {
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

    if (!requiredScopes) {
      return cb(null, body);
    }

    getFacebookPermissions(accessToken, function(err, scopes) {
      var grantedScopes = [];

      for (var index in scopes) {
        if (scopes.hasOwnProperty(index)) {
          var scope = scopes[index];

          if (scope.status === 'granted') {
            grantedScopes.push(scope.permission);
          }
        }
      }

      for (var index in requiredScopes) {
        if (requiredScopes.hasOwnProperty(index)) {
          var rScope = requiredScopes[index];
          if (grantedScopes.indexOf(rScope) === -1) {
            var msg = 'Facebook profile authorization has insufficient scopes';
            return cb(new Error(msg));
          }
        }
      }
      cb(null, body);
    });
  };

getFacebookPermissions = function(accessToken, cb) {
  request({
    url: 'https://graph.facebook.com/me/permissions?access_token=' + accessToken,
    json: true
  },
  function (err, res, body) {
    if (err) {
      return cb(err);
    }

    if (body && body.error) {
      var msg = body.error.message || 'Could not get Facebook profile permissions.';
      return cb(new Error(msg));
    }

    cb(null, body.data);
  });
}