const cool = require("cool-ascii-faces");
const express = require('express')
const app = express();
const axios = require("axios").default;
const bodyParser  = require('body-parser');
// const jsdom = require('jsdom');
// const $ = require('jquery')(new jsdom.JSDOM().window);
const path = require('path');
const PORT = process.env.PORT || 5000;

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set("view options", {layout: false});
app.use('/', express.static(__dirname));
app.use(bodyParser.json());


var textdata = "null";

app.post("/cool", (req, res) => {
  let text = req.body["text"];
  textdata = text;
  console.log("POST");
  res.end();
}); 

app.get("/cool", (req, res) => {
  res.render("pages/cool", {data: textdata});
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));