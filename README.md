# Node.js Starter Overview

The Node.js Starter demonstrates a simple, reusable Node.js web application based on the Express framework.

## Run the app locally

1. [Install Node.js][]
2. Clone this repo
3. cd into the nodebot directory
4. Run `npm install` to install the app's dependencies
5. Make a copy of the config/credentials-template.json file and call it credentials.json
6. From your Bluemix Watson Conversation Service make a copy of the config credentials ![Watson Config Credentials](https://raw.githubusercontent.com/antonmc/nodebot/master/public/images/watson-config.png)

7. Paste the Watson Config credentials into your credentials.json file
8. From your Watson Conversation Workspace copy the workspace id ![Watson Workspace ID](https://raw.githubusercontent.com/antonmc/nodebot/master/public/images/watson-workspace-id.png)

9. Write that ID into the bot.js file: ```var conversationWorkspace = "y o u r   i d   g o e s    h e r e";```

10. Run `node app` to start the app
11. Access the running app in a browser at the url indicated at the node command line

[Install Node.js]: https://nodejs.org/en/download/
