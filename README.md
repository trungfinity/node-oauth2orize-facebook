# oauth2orize-facebook

Facebook token exchange middleware for OAuth2 server toolkit [oauth2orize][oauth2orize-url].

Inspired from [oauth2orize][oauth2orize-url]'s built-in exchanger
[password](https://github.com/jaredhanson/oauth2orize/blob/master/lib/exchange/password.js).

## Installation

```sh
npm i oauth2orize-facebook -S
```

## Usage

```js
var oauth2orize = require('oauth2orize');
var oauth2orizeFacebook = require('oauth2orize-facebook');

var server = oauth2orize.createServer();

server.exchange(oauth2orizeFacebook(function (client, profile, scope, cb) {
  // Get access token from client and Facebook profile information.
  var accessToken = 'access token';

  // Refresh token could be returned if it is supported by your OAuth2 server.
  // If not available, just pass `null` as argument.
  var refreshToken = 'optional refresh token';

  // Additional parameters to return in response. Pass `null` if not available.
  var params = {
    'welcome_to': 'our OAuth2 server',
    'glad_to': 'meet you'
  };

  cb(null, accessToken, refreshToken, params);
  // Or just `cb(null, accessToken);` is enough.
}));
```


## Options

**requiredScopes**

Required scopes allows the exchange middleware to throw an error if the user does not allow a permission required for the application to work.
The requiredScopes are specified within the options (`opts`) object.

```js
server.exchange(
    oauth2orizeFacebook(
        {
            requiredScopes: ['scope1', 'scope2']
        },
        function (client, profile, scope, cb) {
            // ...
        }
    )
);
```
## License

MIT licensed.

[oauth2orize-url]: https://www.npmjs.com/package/oauth2orize
