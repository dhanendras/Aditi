var builder = require('botbuilder');
var restify = require('restify');
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

var connector = new builder.ChatConnector({
    appId: '95a0a3f3-0616-4339-b161-1555e6784b4c',
    appPassword: '8XjAupopDJzuiEHzqNbpdOV'
});
server.post('/api/messages', connector.listen());

//luis intent recogniser
const intent = new builder.IntentDialog({
    recognizers: [
        new builder.LuisRecognizer(LuisModelUrl)
    ]
});

var bot = new builder.UniversalBot(connector,[
    function(session){
       session.send('Welcome to Infinity Labs.');
        session.send('My name is Aditi');
        session.beginDialog('name');
    },
    
    
function(session,results){
    session.beginDialog('error');
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

bot.dialog('name',[
    function(session){
        var intro ={"know": ['May I bother you to introduce yourselves?','Please introduce yourselves','May I know your name(s)?',]};
        builder.Prompts.text(session,intro.know);
    },
    function(session,next){
        var response = session.message.text;
        builder.LuisRecognizer.recognize(response, LuisModelUrl, function (err, intents, entities,next){
            var results = {};
            results.entities == entities;
            results.intents == intents;
            console.log('%s',JSON.stringify(intents));
            topIntent = intents[0].intent;
            if(topIntent=='intro'){
                console.log('intent intro');
                var response = session.message.text;
                builder.LuisRecognizer.recognize(response, LuisModelUrl, function (err, intents, entities,next){
                    var results = {};
                    results.entities == entities;
                    //session.send('%s',JSON.stringify(entities));
                    i = 0;
                    session.userData.names = {};
                    for(i==0;i<entities.length;i++){
                    if(entities[i].type=='name'){
                        var clientName = entities[i].entity;
                        var hey ={"hey": ['Hello %s','Hey %s','Nice to meet you %s','Hey there %s']};
                        session.send(hey.hey,clientName);   
                        session.userData.names += clientName;
                        session.beginDialog('greet');
                    }else{
                        session.send('That is a an elegant name, care to repeat it for me?');
                        session.beginDialog('name');    
                    }
                }
                
                })
                
            }
            else{
                if(topIntent=='SmallTalk'){
                    session.beginDialog('smallTalk');
                }else if(topIntent=='no'){
                    session.send('I need to know your name');
                    session.beginDialog('name');
                } else{
                    session.send('Sorry, I did not quite get that');
                    session.beginDialog('name');
                }
            }
    })},
    function(session,results){
        session.beginDialog('name');
    }
]);

bot.dialog('greet',[    
    function(session,results,args,next){
        builder.Prompts.text(session,'How was your day so far?');
    },
    function(session,results){
        var response = session.message.text;
        builder.LuisRecognizer.recognize(response, LuisModelUrl, function (err, intents, entities,next){
            var results = {};
            results.intents == intents;
            topIntent=intents[0].intent;
            console.log('%s',JSON.stringify(intents));
            if(topIntent=='SmallTalk' && intents[0].score>0.8){
                session.beginDialog('smallTalk');
            } else{
                analyticsService.getScore(response).then(score => {            
                    var newScore = parseFloat(score);
                    if (!isNaN(newScore)) {
                            if (newScore > 0.75) {
                                var good = {"good" :['Great','That is good to hear','Excellent','Good to know that']};
                                session.send(good.good);
                                session.beginDialog('ezone')
                            } 
                            else if (newScore < 0.25) {
                                var bad = {"bad":['I am sorry to hear that','That is unfortunate','Oh my','Oh oh']};
                                session.send(bad.bad);
                                session.send('Maybe this presentation will cheer you up')
                                session.beginDialog('ezone');
                            } 
                            else {
                                var zero = {"zero":['Same here','Just an other ordinary day then','Seems alright','Good to know']};
                                session.send(zero.zero);
                                session.beginDialog('ezone');
                            }
                        }
                })
            }
                 
                    
        })
    },
    function(session,results){
        session.beginDialog('ezone');
    }
]);

bot.dialog('ezone',[
    function(session,results){
        builder.Prompts.text(session,'Shall we move on to our Innovation Framework?');
    },
    function(session,results,args){
        builder.LuisRecognizer.recognize(session.message.text, LuisModelUrl, function (err, intents, entities,next){
            var results = {};
            results.intents == intents;
            if(intents[0].intent=='yes'){
                next();
            }else if(intents[0].intent=='no'){
                builder.Prompts.confirm(session,'Are you sure you want to skip it?');
                if(results.response=='yes'){
                    session.send('Okay, let us skip it');
                    session.beginDialog(demoOv);
                }else{
                    session.send('Great, I promise you it will be worth it');
                    next();
                }
            }else{
                session.send('I did not quite get that');
                session.beginDialog(ezone);
            }
        })
    },
    function(session){
        builder.Prompts.text(session,'para1 with me so far?');
    },
    function(session,results){
        var response = session.message.text;
        builder.LuisRecognizer.recognize(response, LuisModelUrl, function (err, intents, entities,next){
            var results = {};
            results.entities == entities;
            results.intents == intents;
            topIntent==intents[0].intent;
            if(topIntent=='yes'){
                next()
            } else if(topIntent=='no'){
                session.send('Hmm');
                session.beginDialog('question');
            } else if(topIntent=='question'){
                session.beginDialog('question');
            } else if(topIntent=='SmallTalk'){
                session.beginDialog('smallTalk');
            }

        })
    },
    function(session,resuls){
        
    }
]);

bot.dialog('smallTalk',[
    function(session,args){        
        // Post user's question to QnA smalltalk kb
        qnaClient.post({ question: session.message.text }, function (err, results) {
            if (err) {
                console.error('Error from callback:', err);
                session.send('Oops - something went wrong.');
                return;
            }

            if (results) {
                // Send reply from QnA back to user
                session.send(results);
                session.endDialog();
            } else {
                // Put whatever default message/attachments you want here
                session.send('Hmm, I didn\'t quite understand you there. Care to rephrase?')
            }
        });
    }
]);

bot.dialog('questions',[

]);

bot.dialog('eZone',[
    function(session,results){
        session.send('Let us start with a brief video which talks about our Innovation Ecosystem.');
        const msg = new builder.Message(session);
        msg.addAttachment({contentType: 'video/mp4', contentUrl: 'https://youtu.be/A9Vu9n7YxrI'});
        session.send(msg);    
        builder.Prompts.text(session,'Please let me know when you are done with the video');
    },
    function(session,results){
        var response = session.message.text;
        builder.LuisRecognizer.recognize(response, LuisModelUrl, function (err, intents, entities,next){
            var results = {};
            results.entities == entities;
            results.intents == intents;
            topIntent==intents[0].intent;
            if(topIntent=='question'){
                session.beginDialog('question');
            }else if(topIntent=='SmallTalk'){
                session.beginDialog('smallTalk');
            } else{
                next();
            }
        })
    },
    function(session,results){
        session.send('Hope you got a fair understanding of our Innovation ecosystem. The presentations might continue for 20 more mins. Please feel free to make the best use of the chairs around');
        session.endDialog();
    }
]);
