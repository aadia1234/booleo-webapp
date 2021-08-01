const cool = require("cool-ascii-faces");
const express = require('express')
const app = express();
const axios = require("axios").default;
// const jsdom = require('jsdom');
// const $ = require('jquery')(new jsdom.JSDOM().window);
const path = require('path');
const PORT = process.env.PORT || 5000;

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))


app.use(express.json());


var textdata = "null";

app.post("/NemoText", (req, res) => {
  let text = req.body["text"];
  textdata = text;
  console.log("POST");
  res.end();
}); 

app.get("/cool", (req, res) => {
  res.render("pages/cool", {data: textdata});
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));