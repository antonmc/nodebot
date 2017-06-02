var params = {}; // Object for parameters sent to the Watson Conversation service
var context;

function resize(event) {}

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

            // Display the user's text in the chat box and null out input box
            personBubble(text);
            userInput.value = '';

            sendMessageToWatson(text);

        } else {

            // Blank user message. Do nothing.
            console.error("No message.");
            userInput.value = '';

            return false;
        }
    }
}

function sendMessageToWatson(message) {

    // Set parameters for payload to Watson Conversation

    params.text = message; // User defined text to be sent to service

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
