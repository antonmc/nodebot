// This application uses express as a web server
// for more info, see: http://expressjs.com
var express = require('express');
var bodyParser = require('body-parser');

var request=require('request');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

app.use(bodyParser());

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

var watson = require('watson-developer-cloud');

var config = require('./config/credentials.json');

var body = '';

var chatbot = require('./bot.js');

app.post('/outpost', function(req, res) {

  res.setHeader('Content-Type', 'application/json');

  console.log('dorinha heard a question ... ');

  chatbot.sendMessage(req.body.text, req.body.context, function(response) {

    // console.log(response);

    if (response.entities.length > 0) {

      if (response.entities[0].entity === 'druglist') {
        console.log('here is where to search for the drugs');

        var remedies = 'https://gateway-cidadao.campinas.sp.gov.br/api/v1/remedios';

        var json = {
          "name": "Test",
          "email": "test@xxxx.in",
          "phone": "989898xxxx"
        };

        var options = {
          url: remedies,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json','User-Agent':'Mozilla'
          },
          json: json
        };

        request(options, function(err, res, body) {
          if (res && (res.statusCode === 200 || res.statusCode === 201)) {
            console.log(body);
          }
        });
      }
    }

    // switch (response.intents[0].intent) {
    //     default: console.log('case statement - default - ' + response.intents[0].intent);
    //     break;
    // }

    // if( response.entities[0] !== null && response.entities[0].entity === 'druglist'){
    //   console.log('here is where to search for the drugs');
    // }

    res.send(JSON.stringify(response, null, 3));
  });
});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
