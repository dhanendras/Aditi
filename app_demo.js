/*-----------------------------------------------------------------------------
This Bot is a sample calling bot for Skype.  It's designed to showcase whats 
possible on Skype using the BotBuilder SDK. The demo shows how to create a 
looping menu, recognize speech & DTMF, record messages, play multiple prompts,
and even send a caller a chat message.

# RUN THE BOT:

    You can run the bot locally using ngrok found at https://ngrok.com/.

    * Install and run ngrok in a console window using "ngrok http 3978".
    * Create a bot on https://dev.botframework.com and follow the steps to setup
      a Skype channel. Ensure that you enable calling support for your bots skype
      channel. 
    * For the messaging endpoint in the Details for your Bot at dev.botframework.com,
      ensure you enter the https link from ngrok setup and set
      "<ngrok link>/api/messages" as your bots calling endpoint.
    * For the calling endpoint you setup on dev.botframework.com, copy the https 
      link from ngrok setup and set "<ngrok link>/api/calls" as your bots calling 
      endpoint.
    * Next you need to configure your bots CALLBACK_URL, MICROSOFT_APP_ID, and
      MICROSOFT_APP_PASSWORD environment variables. If you're running VSCode you 
      can add these variables to your the bots launch.json file. If you're not 
      using VSCode you'll need to setup these variables in a console window.
      - CALLBACK_URL: This should be the same endpoint you set as your calling
             endpoint in the developer portal.
      - MICROSOFT_APP_ID: This is the App ID assigned when you created your bot.
      - MICROSOFT_APP_PASSWORD: This was also assigned when you created your bot.
    * To use the bot you'll need to click the join link in the portal which will
      add it as a contact to your skype account. When you click on the bot in 
      your skype client you should see an option to call your bot. If you're 
      adding calling to an existing bot can take up to 24 hours for the calling 
      option to show up.
    * You can run the bot by launching it from VSCode or running "node app.js"
      from a console window.  Then call your bot from a skype client to start
      the demo. 

-----------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

var restify = require('restify');
var builder = require('./core/');
var calling = require('./calling/');
var prompts = require('./prompts');
var analyticsService = require('./models/text-analytics');


//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat bot
var chatConnector = new builder.ChatConnector({
    appId: '95a0a3f3-0616-4339-b161-1555e6784b4c',
    appPassword: '8XjAupopDJzuiEHzqNbpdOV'
});
var chatBot = new builder.UniversalBot(chatConnector);
server.post('/api/messages', chatConnector.listen());

// Create calling bot
var connector = new calling.CallConnector({
    callbackUrl: 'https://a3ed922f.ngrok.io/api/calls',
    appId: '95a0a3f3-0616-4339-b161-1555e6784b4c',
    appPassword: '8XjAupopDJzuiEHzqNbpdOV'
});
var bot = new calling.UniversalCallBot(connector);
server.post('/api/calls', connector.listen());

//=========================================================
// Chat Dialogs
//=========================================================

chatBot.dialog('/', function (session) {
    session.send(prompts.chatGreeting); 
});




//=========================================================
// Calling Dialogs
//=========================================================

bot.dialog('/', [
    function (session) {
        // Send a greeting and start the menu.
                session.beginDialog('greet');

    },
    function (session, results) {
        // Always say goodbye
        session.send(prompts.goodbye);
    }
]);

bot.dialog('greet',[
    function(session,next){
        session.send('Hello <Guest>.  Welcome to Infinity Labs, the place where we collaborate and co create innovative technology enabled solutions for our customers. My name is Aditi and I\'ll be your guide throughout this tour' );
        calling.Prompts.confirm(session, 'How was your day so far?');        

    },
    function (session, results,next) {

        analyticsService.getScore(results.response).then(score => {
            
            var newScore = parseFloat(score);
            if (!isNaN(newScore)) {
                    if (newScore > 0.8) {
                        session.send('Excellent... Let us move on to the experience zone of our Infinity Labs to explore more');
                        next();
                    } 
                    else if (newScore > 0.5) {
                        session.send('Okay, let us move on then');
                        next();
                    } 
                    else {
                        session.send('That sounds awful. Maybe this presentation will cheer you up!');
                        next();
                    }

                }
					else{
					 session.send('Okay,anyways let us move on then');
					 next();
					}
        })
            
    },
    function(session,results,next){
        calling.Prompts.confirm(session,'Let me know when you are settled.');
        
    },
    function(session,results){
        calling.Prompts.confirm(session,'Today we are planning to showcase our Innovation Labs ecosystem followed by demonstration of <Asset> for you. Hope you are good with the plan.');
    },
    function(session,results,args,next){
        var responseTwo = session.message.text;
        builder.LuisRecognizer.recognize(responseTwo, LuisModelUrl, function (err, intents, entities) {
            var resultOne = {};
            resultOne.intents = intents;
            if(intents[0].intent=='yes'){
                session.send('Great!!');
                session.endDialog();
            } else if(intents[0].intent=='no'){
                session.send('Bhavesh, could you look into this and make the necessary changes?');
                session.beginDialog('error');
            } else {
                session.send('Is that a yes?');
                session.endDialog();
            }
        })
    }]);

	
	
bot.dialog('ezone',[

    function(session,results,next){
        session.send('Let us start with a brief video which talks about our Innovation ecosystem');
        session.send('<Video not added>');
    //},
    //function(session,results){
        //const msg = new builder.Message(session);
        //msg.addAttachment({contentType: 'video/mp4', contentUrl: 'https://youtu.be/A9Vu9n7YxrI'} as builder.IAttachment);
        //session.send(msg);
    //},
    //function(session,results){
        session.send('Hope you got a fair understanding of our Innovation ecosystem. The presentations might continue for 20 more mins. Please feel free to make the best use of the chairs around');
        session.endDialog();
    },
]);

//question

bot.dialog('anyQuestions',[
    function(session){
        calling.Prompts.confirm(session,'Do you have any questions?');
    },
    function(session,results,args,next){
        var responseThree = session.message.text;
        builder.LuisRecognizer.recognize(responseThree, LuisModelUrl, function (err, intents, entities) {
            var resultTwo = {};
            resultTwo.intents = intents;
            if (intents[0].intent == 'yes') {
                    session.send('Okay');
                    session.beginDialog('question')
                } else{
                    session.send('Okay, let us continue');
                    session.endDialog();
                } 
            
            })
    }   

])

bot.dialog('question',[
    function(session,results){
        calling.Prompts.confirm(session,'You seem to have a question. Please fire away');
        ////var question = session.message.text;
        // add question to DB
    },
    function(session,results,next){
        session.send('Gokul would be able to explain you in detail');
        calling.Prompts.confirm(session,'Gokul, please let me know when you are done');
    },
    function(session,results){
        //wait
        calling.Prompts.confirm(session,'Did that answer your question?');    
    },
    function(session,results,args,next){
        var responseThree = session.message.text;
        builder.LuisRecognizer.recognize(responseThree, LuisModelUrl, function (err, intents, entities) {
            var resultTwo = {};
            resultTwo.intents = intents;
            if (intents[0].intent == 'yes') {
                    session.send('Glad to hear');
                    session.endDialog();
                } else{
                    session.send('Hmm...Maybe the rest of the presentation would bring you more clarity');
                    session.endDialog();
                } 
            
            })
    }   
])/*.triggerAction({
    matches : 'question',
    onSelectAction : (session,args,next) => {
        session.beginDialog(args,action, args);
    }
})*/;

bot.dialog('moreQuestions',[
    function(session,args,next){
        calling.Prompts.confirm(session,'Do you have any more questions on this topic?');
    },
    function(session,results){
        var responseFour = session.message.text;
        builder.LuisRecognizer.recognize(responseFour, LuisModelUrl, function (err, intents, entities) {
            var resultThree = {};
            resultThree.intents = intents;
            if (intents[0].intent == 'yes') {
                    session.send('Okay');
                    session.beginDialog('question');
                } else if(intents[0].intent=='no') {
                    session.send('Wonderful. Let us continue.');
                    session.endDialog();
                } else {
                    session.send('I did not quite get that');
                    session.beginDialog('moreQuestions');
                }
            })               
    },
        function(session,results){
            session.endDialog();
        }
]);

//feedback

bot.dialog('feedback',[
    function(session){
        session.send('That marks the end of this session');
        calling.Prompts.confirm(session, 'How was it? We appreciate a candid respone!');
    },
    function (session, results, next) {

        analyticsService.getScore(results.response).then(score => {
            
            var newScore = parseFloat(score);
            if (!isNaN(newScore)) {
                    if (newScore > 0.8) {
                        session.send('Thanks <Guest>. It means a lot to us.');
                        next();
                    } 
                    else if (newScore > 0.5) {
                        session.send('Thanks for that positive input');
                        next();
                    } 
                    else {
                        session.send('Thank you for the input. We will definetly work on it');
                        next();
                    }

                }
    //},
    //function(session,results){
        //var fb_sent = session.message.text;
        //add sentiment analysis
        ////var feedback = session.message.text;
        //add FB to DB
        ////if(fb_sent=='pos'){
            ////session.send('Good to hear...');
        ////} else {
            ////session.send('Okay...');
        ////}
        ////session.endDialog();
    })
},
    function(session,results){
        session.endDialog();
    }
    
]);
//demo

bot.dialog('demo',[
    function(session){
        session.send('Fortscale is not just rules-engine. It has been designed from the ground up as a machine learning system that uses advanced computing and mathematics to detect abnormal account behavior indicative of credential compromise or abuse.');
        session.send('<Slides not added>');
        session.send('<POC> and team would take over now');
        calling.Prompts.confirm(session,'<POC>, please let me know when you are done');
    },
    function(session,results){
        session.endDialog();
    }
])

bot.dialog('smart',[
    function(session){
        session.send('smart')
    }
])

bot.dialog('error',[
    function(session){
        session.send('This response flow has not been configuered');
        session.send('Resetting the conversation...');
        session.endConversation();
    }
])