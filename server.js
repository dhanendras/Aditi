
var builder = require('botbuilder');
var restify = require('restify');
var calling = require('botbuilder-calling');

var analyticsService = require('./models/text-analytics');

var restify = require('restify');
var port = process.env.PORT || 8080;

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer();
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);
server.get(/\/public\/?.*/, restify.serveStatic({
    directory: __dirname
}));
server.listen(port, function() {
  console.log('%s listening at %s', server.name, server.url);
});

const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/00075350-0d1e-4f2d-8f6e-75e253066b43?subscription-key=468963da9804413788459981febe3bb6&timezoneOffset=0&verbose=true&q= ';


//luis intent recogniser
const intent = new builder.IntentDialog({
    recognizers: [
        new builder.LuisRecognizer(LuisModelUrl)
    ]
});
// Create bot

var connector = new calling.CallConnector({
    appId: '95a0a3f3-0616-4339-b161-1555e6784b4c',
    appPassword: '8XjAupopDJzuiEHzqNbpdOV'
});
server.post('/api/calls', connector.listen());
var bot = new calling.UniversalCallBot(connector);

// Add root dialog
bot.dialog('/', function (session) {
    session.send('Watson... come here!');
});
/*
var bot = new builder.UniversalBot(connector, function (session) {
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});
*/
/*
var bot = new calling.UniversalCallBot(connector,[

    function(session,next){
        session.beginDialog('greet');
    },
    function(session,results){
        session.beginDialog('ezone');
    },
    function(session,results){
        builder.Prompts.text(session,'Are we good to continue with the demonstration of <Asset>?');
    },
    function(session,results,next){
        var responseOne = session.message.text;
        builder.LuisRecognizer.recognize(responseOne, LuisModelUrl, function (err, intents, entities) {
            var result = {};
            result.intents = intents;
            result.entities = entities;
            if (intents[0].intent=='yes') {
                    session.beginDialog('demo');
                } else {
                    session.send('Is there some issue?');
                    session.beginDialog('error');
                } 
            
            })     
    
    },
    function(session,results){
        session.beginDialog('anyQuestions');
    },
    function(session){
        session.beginDialog('moreQuestions');
    },
    function(session){
        session.beginDialog('feedback');
    },
    function(session){
        session.send('Thank you for the visit <Guest>!');
        session.endConversation();
    }
]);

bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, '/');
            }
        });
    }
});

bot.recognizer(new builder.LuisRecognizer(LuisModelUrl));  


//Greet

bot.dialog('greet',[
    function(session,next){
        session.send('Hello <Guest>.  Welcome to Infinity Labs, the place where we collaborate and co create innovative technology enabled solutions for our customers. My name is Aditi and I\'ll be your guide throughout this tour' );
        builder.Prompts.text(session,'How was your day so far?');
    },
    function (session, results, next) {

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
        })
            
    },
    function(session,results){
        builder.Prompts.text(session,'Let me know when you are settled.');
        
    },
    function(session,results){
        builder.Prompts.text(session,'Today we are planning to showcase our Innovation Labs ecosystem followed by demonstration of <Asset> for you. Hope you are good with the plan.');
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

//ezone

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
        builder.Prompts.text(session,'Do you have any questions?');
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
        builder.Prompts.text(session,'You seem to have a question. Please fire away');
        ////var question = session.message.text;
        // add question to DB
    },
    function(session,results,next){
        session.send('Gokul would be able to explain you in detail');
        builder.Prompts.text(session,'Gokul, please let me know when you are done');
    },
    function(session,results){
        //wait
        builder.Prompts.text(session,'Did that answer your question?');    
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
]).triggerAction({
    matches : 'question',
    onSelectAction : (session,args,next) => {
        session.beginDialog(args,action, args);
    }
});

bot.dialog('moreQuestions',[
    function(session,args,next){
        builder.Prompts.text(session,'Do you have any more questions on this topic?');
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
        builder.Prompts.text(session, 'How was it? We appreciate a candid respone!');
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
        builder.Prompts.text(session,'<POC>, please let me know when you are done');
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
*/
