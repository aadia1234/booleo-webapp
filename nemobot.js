const axios = require('axios');
const input_ary = 'topic - subtopic - vidtype - N';

axios({
  method: 'post', 
  baseURL: 'https://limitless-hamlet-40360.herokuapp.com', //our server url
  url: '/cool',
  'Content-Type': 'application/json',
  data: {
    specifics: input_ary
  }

})
.then((result) => { console.log(result) })
.catch((err) => { console.error(err) });