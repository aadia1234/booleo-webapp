// Nemobot JS script running on the Nemobot server
// Use axios to post data to personal server and get the returned value using Promise (then function).

'use strict';
const axios = require('axios');

const start = (say, sendButton) => {
// 	say("This is a demo showing how to connect web page together with Nemobot JS script").then(() => {
	sendButton('are you ready?', [{title: 'Yes', payload: 'Ready'},'No']);
// 	});
};
const state = (payload, say, sendButton) => {
    if(payload == 'Ready' || payload == 'TryAgain'){
    say("Please select one of the following options, and your message will be passed to https://nemobotweb.df.r.appspot.com/test").then(()=>{
        sendButton("Have fun! ",[{title: 'Hello World 😀', payload: 'Hello World 😀'},{title: 'Nice to meet you 🤗', payload: 'Nice to meet you 🤗'},{title: 'Hakuna Matata 🦁', payload: 'Hakuna Matata 🦁'}])
    })
    } else {
        axios({
        method: 'post',
        baseURL: 'Your server URL',
        url: '/NemoText',
        'Content-Type': 'application/json',
        data: {
            text: payload
        }
        })
        .then((result) => {
	// get the returned data here.
	})
        .catch((err) => {})
        sendButton("Try again?",[{title: 'Yes', payload: 'TryAgain'},'No']);
    }
};

module.exports = {
	filename: 'helloworld',
	title: 'Hello World SIS',
	introduction: [
		'This is a demo showing how to connect web page together with Nemobot JS script 🤩!'
	],
	start: start,
	state: state
};