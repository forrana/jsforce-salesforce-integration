const jsforce = require('jsforce');
const fs = require('fs');
const conn = new jsforce.Connection();


fileOut = fs.createWriteStream('./updloaded.doc')

conn.login('forrana@gmail.com', 'AsF01305218LKgn4MdS0X6DKsWSGo3EA5Oa', function(err, res) {
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
});
