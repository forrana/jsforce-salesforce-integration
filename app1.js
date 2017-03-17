const jsforce = require('jsforce'),
    express = require('express'),
    app = express(),
    request = require('request'),
    fs = require('fs'),
    fileOut = fs.createWriteStream('./updloaded.doc');

// OAuth2 client information can be shared with multiple connections.
var oauth2 = new jsforce.OAuth2({
  // you can change loginUrl to connect to sandbox or prerelease env.
  // loginUrl : 'https://ap4.salesforce.com',
  clientId : '3MVG9YDQS5WtC11ptisru2ZbKjAa4IZYKmA5Lz2qkGYBnjj7JCHDWvzovs14wan32n.MasOZ0hhaesOCq.Eri',
  clientSecret : '2282910486830136445',
  redirectUri : 'http://localhost:3000/oauth2/callback'
});

app.get('/oauth2/auth', function(req, res) {
    res.redirect(oauth2.getAuthorizationUrl({ scope : 'api id web' }));
});

//
// Pass received authz code and get access token
//

app.get('/oauth2/callback', function(req, res) {
  var conn = new jsforce.Connection({ oauth2 : oauth2 });
  var code = req.param('code');
  conn.authorize(code, function(err, userInfo) {
    if (err) { return console.error(err); }
    conn.query('SELECT Id, Name, body FROM Document', function(err, res) {
       if (err) { return console.error(err); }

       console.log(res);
       console.log(res.records[0].Id);
       conn.sobject('Document')
         .record(res.records[0].Id)
         .blob('Body')
         .pipe(fileOut)
         .on("error", (err) => {
           console.log(err);
         });
     });
     res.send('<h1>Done</h1>');
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
