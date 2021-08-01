
'use strict';
const axios = require('axios');
const options = [{title: "Yes", payload: "start"}, "No"];

const start = (say, sendButton) => {
  let payload = {};

  axios({
    method: "get",
    baseURL: "https://limitless-hamlet-40360.herokuapp.com",
    url: "/NemoText",
  })
  .then((result) => {
    say("Recieved data");
    let data = result.data;
    payload["text"] = data["text"];
  })
  .catch((err) => {
    say("Sorry, there was an error");
  });
  sendButton("Start?", options);
};

const state = (payload, say, sendButton) => {
  say("checkout this website for more info: https://limitless-hamlet-40360.herokuapp.com/cool").then(() => {
    say(payload["text"]);
  });
  sendButton("Play Again?", options);
};

module.exports = {
	filename: 'web_service',
	title: 'External web service demo',
	introduction: [
		'This is a demo showing how to connect web page together with Nemobot JS script 🤩!'
	],
	start: start,
	state: state
};
