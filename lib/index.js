'use strict';

var AuthorizationError = require('oauth2orize').AuthorizationError;
var objectAssign = require('object-assign');

var getFacebookProfile = require('./util').getFacebookProfile;

module.exports = function (opts, fields, issue) {
  if (Array.isArray(opts)) {
    issue = fields;
    fields = opts;
    opts = null;
  }

  if (typeof opts === 'function') {
    issue = opts;
    opts = null;
    fields = null;
  }

  if (fields != null && !Array.isArray(fields)) {
    throw new Error('You must specify the Facebook profile fields as an array.' +
      'Also, make sure you have permission to access these fields');
  }

  if (typeof issue !== 'function') {
    throw new Error('OAuth 2.0 password exchange middleware ' +
      'requires an issue function.');
  }

  opts = opts || {};

  var userProperty = opts.userProperty || 'user';
  var separators = opts.scopeSeparator || ' ';

  if (!Array.isArray(separators)) {
    separators = [ separators ];
  }

  return function facebook(req, res, next) {
    if (!req.body) {
      return next(new Error('Request body not parsed. ' +
          'Use bodyParser middleware.'));
    }

    // The `user` property of `req` holds the authenticated user. In the case
    // of the token end-point, this property will contain the OAuth 2.0 client.
    var client = req[userProperty];

    var token = req.body.token;
    var scope = req.body.scope;

    if (!token) {
      return next(new AuthorizationError(
          'Missing Facebook access token!', 'invalid_request'));
    }

    getFacebookProfile(fields, token, function (err, profile) {
        if (err) {
          console.log(err);
          return next(new AuthorizationError(
              'Could not get Facebook profile using provided access token.',
              'invalid_request'
          ));
        }

        if (scope) {
          for (var i = 0, len = separators.length; i < len; i++) {
            // Only separates on the first matching separator.
            // This allows for a sort of separator "priority"
            // (ie, favors spaces then fallback to commas).
            var separated = scope.split(separators[i]);

            if (separated.length > 1) {
              scope = separated;
              break;
            }
          }

          if (!Array.isArray(scope)) {
            scope = [ scope ];
          }
        }

        var issued = function (err, accessToken, refreshToken, params) {
          if (err) {
            return next(err);
          }

          if (!accessToken) {
            return next(new AuthorizationError(
                'Permissions was not granted.', 'invalid_grant'));
          }

          var json = { 'access_token': accessToken };

          if (refreshToken) {
            json['refresh_token'] = refreshToken;
          }

          if (params) {
            objectAssign(json, params);
          }

          json['token_type'] = json['token_type'] || 'bearer';
          json = JSON.stringify(json);

          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-store');
          res.setHeader('Pragma', 'no-cache');
          res.end(json);
        };

        issue(client, profile, scope, issued);
    });
  };
};
