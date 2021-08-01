
'use strict';
const axios = require('axios');
const options = [{title: "Yes", payload: "start"}, "No"];

const start = (say, sendButton) => {
  sendButton("Start?", options);
};

const state = (payload, say, sendButton) => {

  if (payload == "start") {
    say("checkout this website for more info: https://limitless-hamlet-40360.herokuapp.com/cool");
    
    axios({
      method: "get",
      baseURL: "https://limitless-hamlet-40360.herokuapp.com",
      url: "/NemoText"
    })
    .then((result) => {
      say("Data recieved: " + result.data["text"]);
    })
    .catch((error) => {
      say("Sorry, there was an error");
    });

    sendButton("Play Again?", options);
  }
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
