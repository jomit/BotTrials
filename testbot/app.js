const restify = require('restify')
const builder = require('botbuilder')
const _ = require('lodash')
//const config = require('./config')
// const dispatcher = require('./dispatcher')
// const cabifyReservations = require('./cabify-reservations')
// const geocode = require('./geocode')

const connector = new builder.ChatConnector({
   //appId: config.appId,
  //appPassword: config.appPassword
  })

const bot = new builder.UniversalBot(connector)

//LUIS natural language processing
var model = '';
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);
var requestor="";
var customer="";
var location="",idsid="",productname="";

//Intent handlers
dialog.matches('greetings', builder.DialogAction.send('Hello. this is your BOT. What do you want to do?'));

dialog.matches('release info', [
    function (session, args, next) {
        console.log(args)
        // Resolve and store any entities passed from LUIS.
        var programName = builder.EntityRecognizer.findEntity(args.intent.entities, 'programName');
        var sku = builder.EntityRecognizer.findEntity(args.entities, 'sku');
        var version = builder.EntityRecognizer.findEntity(args.entities, 'version');
      //  console.log('ENTITIES', device, typeOfDevice)
        var booking = {
            programName: programName ? programName.entity : null,
            sku: sku ? sku.entity : null,
            version: version ? version.entity : null
        }
        session.dialogData.booking = booking
        //console.log('BOOKING-1', booking);

        // Prompt for title
        if (!booking.programName) {
            //builder.Prompts.text(session, 'What\'s the program name?')
            var programNames = ["cnl","kbl"];  //populate this using the REST API : https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c26/console
            builder.Prompts.choice(session, 'What\'s the program name?', programNames,{ listStyle: 0 });
        } else {
            next();
        }
    },
    function (session, results, next) {
       // console.log('second block')
        var booking = session.dialogData.booking
        if (results.response) {
            console.log('RESPONSE', results);
            console.log('BOOKING', booking);
            booking.programName = results.response;
        } 

        if (booking.programName && !booking.sku){
            builder.Prompts.text(session, 'What is the SKU?')
        } else {
            next();
        }


    },
    function (session, results, next) {
        // console.log('second block')
         var booking = session.dialogData.booking
         if (results.response) {
            // console.log('RESPONSE', results)
             booking.sku = results.response
         } 
 
         if (booking.programName && booking.sku && !booking.version){
             builder.Prompts.text(session, 'What is the version?')
         } else {
             next();
         }
 
 
     },
    function(session, results, next) {
     //   console.log('third block');
        var booking = session.dialogData.booking
        if (results.response) {
         //   console.log('RESPONSE', results)
            booking.version = results.response
        }
        if(booking.version && booking.programName && booking.sku){
            if(booking.version=="latest"){
                session.send("Here is the info on latest version")
            
            }else{
                session.send("Here is the info on the release")
          
            }
        }
       

    }
]);

dialog.onDefault(builder.DialogAction.send("I'm sorry I didn't understand."));

const server = restify.createServer()
server.listen(8080)
server.post('/', connector.listen())
console.log('listening')