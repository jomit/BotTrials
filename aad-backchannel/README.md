# AAD App Registration Steps

- Register App  : https://apps.dev.microsoft.com/

- Edit Mainfest :
    - oauth2AllowImplicitFlow: true
    - replyUrls : ["http://localhost:3000"]

# Bot App Registration

- Create new Bot Service (Web App) 

- Extend the service to add the following code (for nodejs):

    bot.on("event", function (event) {
        var msg = new builder.Message().address(event.address);
        msg.textLocale("en-us");
        if (event.name === "login") {
            msg.text("Verified AADToken : " + event.value);
        }
        bot.send(msg);
    });

# Run the App

- `node app.js`