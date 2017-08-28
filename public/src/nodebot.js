var params = {}; // Object for parameters sent to the Watson Conversation service
var context;

var drugs;

function initialize() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(sendLocationToServer);
    } else {
        console.log("Geolocation is not supported by this browser");
    }
}

function sendLocationToServer(position) {

    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    var location = {
        latitude: latitude,
        longitude: longitude
    };

    var xhr = new XMLHttpRequest();
    var uri = '/location';

    xhr.open('POST', uri, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {

        if (xhr.status === 200 && xhr.responseText) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
        } else {
            console.error(xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error('Network error trying to send message!');
    };

    xhr.send(JSON.stringify(location));
}

function resize(event) {}

function handleFocus(event) {
    console.log('focus');
}

/**
 * @summary Enter Keyboard Event.
 *
 * When a user presses enter in the chat input window it triggers the service interactions.
 *
 * @function newEvent
 * @param {Object} e - Information about the keyboard event.
 */
function handleInput(e) {
    // Only check for a return/enter press - Event 13
    if (e.which === 13 || e.keyCode === 13) {

        var userInput = document.getElementById('chatMessage');
        text = userInput.value; // Using text as a recurring variable through functions
        text = text.replace(/(\r\n|\n|\r)/gm, ""); // Remove erroneous characters

        // If there is any input then check if this is a claim step
        // Some claim steps are handled in newEvent and others are handled in userMessage
        if (text) {

            if (drugs !== undefined) {
                var index = parseInt(text);
                personBubble(text);
                userInput.value = '';
                sendMessageToWatson(drugs[index].label, drugs[index]);
                drugs = null;
            } else {

                // Display the user's text in the chat box and null out input box
                personBubble(text);
                userInput.value = '';

                sendMessageToWatson(text);
            }

        } else {

            // Blank user message. Do nothing.
            console.error("No message.");
            userInput.value = '';

            return false;
        }
    }
}

function sendMessageToWatson(message, drug) {

    // Set parameters for payload to Watson Conversation

    params.text = message; // User defined text to be sent to service
    if (drug) {
        params.drug = drug;
    }

    if (context) {
        params.context = context;
    }

    var xhr = new XMLHttpRequest();
    var uri = '/outpost';

    xhr.open('POST', uri, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {

        // Verify if there is a success code response and some text was sent
        if (xhr.status === 200 && xhr.responseText) {

            var response = JSON.parse(xhr.responseText);
            text = response.output.text; // Only display the first response
            context = response.context; // Store the context for next round of questions

            console.log('context: ' + JSON.stringify(response));

            console.log("Got response from Watson: ", text[0]);

            scoutBubble(text[0]);

            //            mapBubble(text[0]);

            drugs = response.drugs

            var count = 1;

            if (response.drugs) {

                response.drugs.forEach(function (drug) {
                    scoutBubble(count + ': ' + drug.label);
                    count++;
                })
            }

            if (response.map) {
                scoutBubble(response.output.text);
                scoutBubble(response.map.nome);
                mapBubble();
            }

        } else {
            console.error('Server error for Conversation. Return status of: ', xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error('Network error trying to send message!');
    };

    console.log(JSON.stringify(params));

    xhr.send(JSON.stringify(params));
}

function personBubble(message) {
    console.log(message);
    var bubble = document.createElement('div');
    bubble.className = 'person';
    bubble.innerHTML = '<div class = "person-content">' + message + '</div>';

    var conversation = document.getElementById('conversationflow');
    conversation.appendChild(bubble);
    conversation.scrollTop = conversation.scrollHeight;
}

function scoutBubble(message) {
    console.log(message);
    var bubble = document.createElement('div');
    bubble.className = 'scoutbot';
    bubble.innerHTML = '<div class = "scoutbot-content">' + message + '</div>';

    var conversation = document.getElementById('conversationflow');
    conversation.appendChild(bubble);
    conversation.scrollTop = conversation.scrollHeight;
}

function initMap(id) {
    var myLatLng = {
        lat: -25.363,
        lng: 131.044
    };

    var map = new google.maps.Map(document.getElementById(id), {
        zoom: 4,
        center: myLatLng
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Hello World!'
    });

    setTimeout(function () {
        google.maps.event.trigger(map, 'resize')
    }, 600);
}


function mapBubble(message) {
    console.log('map bubble');

    var bubble = document.createElement('div');

    bubble.className = 'mapfragment';

    var id = Math.random() + "map";

    bubble.innerHTML = '<div height=200; width=200; id="' + id + '"></div>'

    var conversation = document.getElementById('conversationflow');

    conversation.appendChild(bubble);

    initMap(id);

    conversation.scrollTop = conversation.scrollHeight;
}
