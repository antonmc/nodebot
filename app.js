// This application uses express as a web server
// for more info, see: http://expressjs.com
var express = require('express');
var bodyParser = require('body-parser');

var request = require('request');

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

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)

function calcCrow(lat1, lon1, lat2, lon2){
  let R = 6371; // km
  let dLat = this.toRad(lat2-lat1);
  let dLon = this.toRad(lon2-lon1);
  lat1 = this.toRad(lat1);
  lat2 = this.toRad(lat2);

  let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  let d = R * c;
  return d;
}

    // Converts numeric degrees to radians
function toRad(Value) {
  return Value * Math.PI / 180;
}

app.post('/outpost', function(req, res) {

  res.setHeader('Content-Type', 'application/json');

  console.log('dorinha heard a question ... ');

  if (req.body.drug) {

    console.log( 'this is where we look for a clinic' );

    var clinics = 'https://gateway-cidadao.campinas.sp.gov.br/api/v1/remedios/centros/saude';
    clinics = clinics + '?id_remedio=' + req.body.drug.id;

    var options = {
      url: clinics,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla'
      },
      json: null
    };

    request(options, function(err, newresponse, clinics) {

      console.log(newresponse);

      if (newresponse && (newresponse.statusCode === 200 || newresponse.statusCode === 201)) {

        var closestIndex = 0;

        // var  = newresponse.body;

        // postoDeSaude

        console.log(clinics);
      }
    })
  } else {

    chatbot.sendMessage(req.body.text, req.body.context, function(response) {

      // console.log(response);

      if (response.entities.length > 0) {

        if (response.entities[0].entity === 'druglist') {
          console.log('here is where to search for the drugs');

          var remedies = 'https://gateway-cidadao.campinas.sp.gov.br/api/v1/remedios';

          var input = response.input.text.toUpperCase();

          input = input.replace(/[|&;$%@"<>()+,]/g, "");

          console.log(input);

          var json = {
            "name": "Test",
            "email": "test@xxxx.in",
            "phone": "989898xxxx"
          };

          var options = {
            url: remedies,
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'Mozilla'
            },
            json: json
          };

          request(options, function(err, newresponse, medicines) {
            if (newresponse && (newresponse.statusCode === 200 || newresponse.statusCode === 201)) {
              // console.log(response);

              var count = 1;

              var findings = 'Which medicine are you looking for:\n';

              var drugs = [];

              medicines.forEach(function(medicine) {

                // console.log(medicine.label);

                //  input = 'DIPIRONA';

                if (medicine.label.indexOf(input) !== -1) {

                  drugs.push(medicine);
                  // findings = findings + count + ': ' + medicine.label + '\n';
                  count++;
                }
              })

              console.log(findings);

              response.output.text[0] = findings;

              response.drugs = drugs;

              res.send(JSON.stringify(response, null, 3));
            }
          });
        }
      } else {
        res.send(JSON.stringify(response, null, 3));
      }

    // switch (response.intents[0].intent) {
    //     default: console.log('case statement - default - ' + response.intents[0].intent);
    //     break;
    // }

    // if( response.entities[0] !== null && response.entities[0].entity === 'druglist'){
    //   console.log('here is where to search for the drugs');
    // }

    // res.send(JSON.stringify(response, null, 3));
  });
}
});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
