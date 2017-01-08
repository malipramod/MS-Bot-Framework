var restify = require('restify');
var builder = require('botbuilder');
var calling = require('botbuilder-calling');
//var salesforce  = require('./salesforce');
var model = process.env.model || 'https://api.projectoxford.ai/luis/v2.0/apps/49bb6619-2fef-4d91-b312-cfbcaf7bc3f0?subscription-key=981d47f721b34134b215028aef3dd333&verbose=true'
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
var http = require('http');
var https = require('https');
 var fs = require('fs');


var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});




 // Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Create call bot	

var callConnector = new calling.CallConnector({
    callbackUrl: 'Azure web service url',
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});


// Chat Bot
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());
bot.dialog('/', intents.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand.")));
 
 intents.matches(/^Hi|Hello|Hey|Hi Max|Help/i, [
    function (session) {
        session.send("Hi, How can I help you ?\n\n I know about Leave and Travel policies.");// \n\n Leave Policy \n\n Travel Policy");
		session.endDialog();
    }
]);
intents.matches('leave', [
    function (session, args, results, next) {
        builder.Prompts.choice(session, "We have following leave types:", ["Leave 1", "Leave 2", "....", "Leave N"]);
		
    },

function(session, args, next) {

var leavetype=args.response.entity;

builder.Prompts.choice(session, "Please choose the option", ["I want to know "+leavetype+" policy","Bye"]);

},

function(session, args, next){
  if(args.response.entity.toLowerCase().indexOf("Leave 1")>0){
      
      if(args.response.entity.toLowerCase().indexOf("policy")>0){
          session.beginDialog("/Leave1");
      }
      
  }

  else if(args.response.entity.toLowerCase().indexOf("Leave 2")>0){
      
      if(args.response.entity.toLowerCase().indexOf("policy")>0){
              session.beginDialog("/Leave2");
      }
     
  }

  else if(args.response.entity.toLowerCase().indexOf("Leave n")>0){
      
      if(args.response.entity.toLowerCase().indexOf("policy")>0){
              session.beginDialog("/Leave3");
      }

     
  }


}
]);

intents.matches('Leave 1',[
    function (session, args, results, next) {
		session.beginDialog("/Leave1");
    },
]);

bot.dialog('/Leave1',[
 function (session, args){
     
var msg = new builder.Message(session).textFormat(builder.TextFormat.xml)
                 .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments([
                new builder.ThumbnailCard(session)
                    .title("Leave1")
                    .images([
                        builder.CardImage.create(session, "http://pramodmali.com/wp-content/uploads/2016/12/vto.jpg")
                    ])
            ]);
            session.send(msg);
            var contents = fs.readFileSync("HRFAQ.json"); 
            var jsonString = JSON.parse(contents);
            builder.Prompts.text(session,jsonString.VolunteerTimeOff);
            session.endDialog();
 }
]);



intents.matches('Leave 2',[
    function (session, args, results, next) {
      session.beginDialog("/Leave2");
    },
]);

bot.dialog('/Leave2',[
 function (session, args){
     	
var msg = new builder.Message(session).textFormat(builder.TextFormat.xml)
                 .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments([
                new builder.ThumbnailCard(session)
                    .title("Leave2")
                    .images([
                        builder.CardImage.create(session, "http://pramodmali.com/wp-content/uploads/2016/12/Sick-Leave.jpg")
                         
                    ])
            ]);
            session.send(msg);
            var contents = fs.readFileSync("HRFAQ.json"); 
            var jsonString = JSON.parse(contents);
            builder.Prompts.text(session,jsonString.sickleave);//"\n * Sick leaves may be used for the employee’s own illness or for the employee to attend to the illness of the employee’s child, parent, spouse or a close relative.\n\n * Full time employees will also accrue five (5) Sick Leaves per year (accrual will take place monthly)\n\n * Part-time employees will accrue sick time pro-rated to the number of hours worked per pay period.");
            session.endDialog();
 }
]);
 

intents.matches('Leave N',[
    function (session, args, results, next) {
       session.beginDialog("/LeaveN");
    },
]);

bot.dialog('/LeaveN',
[function (session, args){
      
  var msg = new builder.Message(session).textFormat(builder.TextFormat.xml)
                 .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments([
                new builder.ThumbnailCard(session)
                    .title("LeaveN")
                    .images([
                        builder.CardImage.create(session, "http://pramodmali.com/wp-content/uploads/2016/12/paid_leave.jpg")
                         
                    ])
            ]);
            session.send(msg);
            var contents = fs.readFileSync("HRFAQ.json"); 
            var jsonString = JSON.parse(contents);
            builder.Prompts.text(session,jsonString.paidleave);
            session.endDialog();
}]);



intents.matches("Holidaylist",[
    function (session, args){
        	var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title('Holiday list')
                    //.subtitle(proposalName)
                    .images([
                        builder.CardImage.create(session, "http://pramodmali.com/wp-content/uploads/2016/12/pdf_img.png")
                    ])
                    .tap(builder.CardAction.openUrl(session, "https://drive.google.com/file/d/0B-oAPrhvQh6nY3Q5SlVxNlBIcHc/view"))
                    .buttons([
                        builder.CardAction.openUrl(session, "https://drive.google.com/file/d/0B-oAPrhvQh6nY3Q5SlVxNlBIcHc/view", "Open")
                    ])
            ]);
	session.send(msg);
    
    session.endDialog();
    }
]);




bot.endConversationAction('bye', 'Bye :)', { matches: /^bye|later|goodbye/i });