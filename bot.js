var watson = require('watson-developer-cloud');
var cfenv = require('cfenv');
var chrono = require('chrono-node');

var config = require('./config/credentials.json');

// =====================================
// CREATE THE SERVICE WRAPPER ==========
// =====================================
// Create the service wrapper
var conversationUsername = config.conversation.credentials.username;
var conversationPassword = config.conversation.credentials.password;
var conversationWorkspace = "aea269b0-9994-4cba-a41a-d529f64a710f";

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
