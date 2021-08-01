// This code is part from the Nemobot.js and can be used to test locally.
const axios = require('axios')
const input_ary = 'topic - subtopic - vidtype - N';

function makeRequest() {
    axios ({
        method: 'post', 
        baseURL: 'http://127.0.0.1:2200/', //our server url
        url: '',
        'Content-Type': 'application/json',
        data: {
            specifics: input_ary
        }
    
    })
        .then((result) => { console.log(result.data) })
        .catch((err) => { console.error(err) })
}

$("#button").addEventListener("click", makeRequest());