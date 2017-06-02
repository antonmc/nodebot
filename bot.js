var watson = require('watson-developer-cloud');
var cfenv = require('cfenv');
var chrono = require('chrono-node');

// =====================================
// CREATE THE SERVICE WRAPPER ==========
// =====================================
// Create the service wrapper
var conversationUsername = "9fd01219-f8f0-4ae5-bf27-7684d6d73fdf";
var conversationPassword = "WNPKrBNDbfPl";
var conversationWorkspace = "9e4c5fbf-8668-4434-a280-c276df237e02";

console.log("Using Watson Conversation with username", conversationUsername, "and workspace", conversationWorkspace);

var conversation = watson.conversation({
    url: "https://gateway.watsonplatform.net/conversation/api",
    username: conversationUsername,
    password: conversationPassword,
    version_date: '2016-07-11',
    version: 'v1'
});

var input = {
    text: 'something'
}

var params = {
    input: input,
    workspace_id: conversationWorkspace,
    context: {}
}

var chatbot = {
    sendMessage: function (stuff, context, callback) {

        params.input.text = stuff;
        params.context = context;

        conversation.message(params, function (err, data) {

            if (err) {
                console.log("Error in sending message: ", err);

            } else {
                callback(data);
            }
        });
    }
}

module.exports = chatbot;
