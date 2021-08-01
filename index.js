const cool = require("cool-ascii-faces");
const express = require('express');
const axios = require("axios").default;
const path = require('path');
const PORT = process.env.PORT || 5000;

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get("/cool", (req, res) => res.render("pages/cool"))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

axios.post("limitless-hamlet-40360.herokuapp.com/cool", {
  coolface: "wewe"
}, {
  headers: {
    "Content-Type": "application/json"
  }
})
.then((result) => { console.log("posted"); })
.catch((error) => { console.log(error); });


// axios({
//   method: "post",
//   // baseURL: "https://limitless-hamlet-40360.herokuapp.com",
//   url: "/cool",
//   data: {
//     coolface: "weewrewrewrew"
//   }
// })
// .then((result) => { console.log(result); })
// .catch((err) => { console.log(err); });
