
'use strict';
const axios = require('axios');
const options = [{title: "Yes", payload: "start"}, "No"];

const start = (say, sendButton) => {
// 	say("This is a demo showing how to connect web page together with Nemobot JS script").then(() => {
// 	sendButton('are you ready?', [{title: 'Yes', payload: 'Ready'},'No']);
// 	});
    sendButton("Start?", options);
};
const state = (payload, say, sendButton) => {

    if (payload == "start") {
        say("checkout this website for more info: https://limitless-hamlet-40360.herokuapp.com").then(() => {
            axios({
               method: "post",
               baseURL: "https://limitless-hamlet-40360.herokuapp.com",
               url: "/cool",
               "Content-Type": "application/json",
               data: {
                   test: "NEMOBOT TEXT!"
               }
            })
            .then((result) => {
                say(result);
            })
            .catch((err) => {
                say("Sorry, there was an error");
            });
        })
        sendButton("Play Again?", options);
        
    }
    

    // if(payload == 'Ready' || payload == 'TryAgain'){
    // say("Please select one of the following options, and your message will be passed to https://nemobotweb.df.r.appspot.com/test").then(()=>{
    //     sendButton("Have fun! ",[{title: 'Hello World 😀', payload: 'Hello World 😀'},{title: 'Nice to meet you 🤗', payload: 'Nice to meet you 🤗'},{title: 'Hakuna Matata 🦁', payload: 'Hakuna Matata 🦁'}])
    // })
    // } else {
    //     axios({
    //     method: 'post',
    //     baseURL: 'http://20200730t143717.default.nemobotweb.df.r.appspot.com',
    //     url: '/NemoTest',
    //     'Content-Type': 'application/json',
    //     data: {
    //         test: payload
    //     }
    //     })
    //     .then((result) => {})
    //     .catch((err) => {})
    //     sendButton("Try again?",[{title: 'Yes', payload: 'TryAgain'},'No']);
    // }
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
