// The core file running on personal server using Nodejs
// Use express to receive data from Nemobot server, return status, and pass data to webpage.

const express = require('express');
const app = express();
const PORT = process.env.PORT || 2200; //picked arbitrary #
const HOSTNAME = '127.0.0.1';
const bodyParser  = require('body-parser');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set("view options", {layout: false});
app.use('/', express.static(__dirname));
app.use(bodyParser.json());

var textdata = "Null";
app.post("/", (req,res) =>{
  var text = req.body["text"];
  textdata = text;
  res.end();

});
app.get("/", (req,res) => {
  res.render('get.html', {data:textdata});
});

// module.exports = app;

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
