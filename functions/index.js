const functions = require("firebase-functions");
const admin = require("firebase-admin");
// eslint-disable-next-line max-len
const serviceAccount = require("./exploresafe-362903-firebase-adminsdk-asnln-e516bce95f.json");

const Twilio = require("twilio");


// Connection to Realtime Database
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://exploresafe-362903-default-rtdb.firebaseio.com",
});
const db = admin.database();
const ref = db.ref("/routes/");

exports.passiveSOS = functions.https.onRequest((request, response) => {
  // Create Twilio Client
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioClient = new Twilio(accountSid, authToken);
  console.log("Here");
  functions.logger.info("Hello logs!", {structuredData: true});
  ref.once("value", (data) => {
    for (const route in data.val()) {
      if (route != null) {
        let performSOS = false;
        const routeData = data.val()[route];
        // const routeID = routeData.route_id;
        // eslint-disable-next-line no-unused-vars
        const passiveSOSTime = routeData.passive_sos_time;
        // eslint-disable-next-line no-unused-vars
        const lastCallbackTime = routeData.last_callback_time;
        const sosMessageSent = routeData.sos_message_sent;

        const minute = 1000 * 60;
        const hour = minute * 60;
        const day = hour * 24;
        const year = day * 365;

        const currentDate = new Date(Date.now());
        // eslint-disable-next-line max-len
        const lastCallbackTimeDate = new Date(lastCallbackTime.year, lastCallbackTime.month, lastCallbackTime.day, lastCallbackTime.hour, lastCallbackTime.minute);
        console.log(passiveSOSTime.value);
        console.log((lastCallbackTimeDate));

        switch (passiveSOSTime.unit) {
          case "Years":
            // eslint-disable-next-line max-len
            if ((currentDate - lastCallbackTimeDate) / year > passiveSOSTime.value) {
              performSOS = true;
            }
            break;
          case "Months":
            // eslint-disable-next-line max-len
            if ((currentDate - lastCallbackTimeDate) / day > (28 * passiveSOSTime.value)) {
              performSOS = true;
            }
            break;
          case "Days":
            // eslint-disable-next-line max-len
            if ((currentDate - lastCallbackTimeDate) / day > passiveSOSTime.value) {
              performSOS = true;
            }
            break;
          case "Hours":
            // eslint-disable-next-line max-len
            if ((currentDate - lastCallbackTimeDate) / hour > passiveSOSTime.value) {
              performSOS = true;
            }
            break;
        }


        if (performSOS && !sosMessageSent) {
          // This acts like there is a need for an SOS notification.
          const TWILIO_FROM_PHONE_NUMBER = process.env.TWILIO_FROM_PHONE_NUMBER;
          const TWILIO_TO_PHONE_NUMBER = process.env.TWILIO_TO_PHONE_NUMBER;
          console.log("SOS");

          // eslint-disable-next-line max-len
          const message = "This is a message from ExploreSafe. At " + currentDate + "today, an automated SOS call was made from Jonathan's ExploreSafe app to alert listed contacts that Jonathan's device has been offline for <TIME>. Please do not be frightned, however, an unexpectedly long amount of time offline may indicate that Jonathan is trapped, lost, or otherwise missing. Please use the link below to access their location history.\nhttps://exploresafe-362903.firebaseapp.com/" + route;
          console.log(message);
          // Create Website with access to server
          // Send link to SMS

          twilioClient.messages
              .create({
                body: message,
                to: TWILIO_TO_PHONE_NUMBER, // Text this number
                from: TWILIO_FROM_PHONE_NUMBER, // From a valid Twilio number
              })
              .then((message) => console.log(message.sid));


          const updateRef = db.ref("/routes/" + route + "/");

          updateRef.update({
            "sos_message_sent": true,
          });
        }
      }
    }
    response.send("Hi");
  });
});


exports.passiveSOSCheck = functions.pubsub.schedule("every 5 minutes")
    .onRun((context) => {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioClient = new Twilio(accountSid, authToken);
      console.log("Here");
      functions.logger.info("Hello logs!", {structuredData: true});
      ref.once("value", (data) => {
        for (const route in data.val()) {
          if (route != null) {
            let performSOS = false;
            const routeData = data.val()[route];
            // const routeID = routeData.route_id;
            // eslint-disable-next-line no-unused-vars
            const passiveSOSTime = routeData.passive_sos_time;
            // eslint-disable-next-line no-unused-vars
            const lastCallbackTime = routeData.last_callback_time;
            const sosMessageSent = routeData.sos_message_sent;

            const minute = 1000 * 60;
            const hour = minute * 60;
            const day = hour * 24;
            const year = day * 365;

            const currentDate = new Date(Date.now());
            // eslint-disable-next-line max-len
            const lastCallbackTimeDate = new Date(lastCallbackTime.year, lastCallbackTime.month, lastCallbackTime.day, lastCallbackTime.hour, lastCallbackTime.minute);
            console.log(passiveSOSTime.value);
            console.log((lastCallbackTimeDate));

            switch (passiveSOSTime.unit) {
              case "Years":
                // eslint-disable-next-line max-len
                if ((currentDate - lastCallbackTimeDate) / year > passiveSOSTime.value) {
                  performSOS = true;
                }
                break;
              case "Months":
                // eslint-disable-next-line max-len
                if ((currentDate - lastCallbackTimeDate) / day > (28 * passiveSOSTime.value)) {
                  performSOS = true;
                }
                break;
              case "Days":
                // eslint-disable-next-line max-len
                if ((currentDate - lastCallbackTimeDate) / day > passiveSOSTime.value) {
                  performSOS = true;
                }
                break;
              case "Hours":
                // eslint-disable-next-line max-len
                if ((currentDate - lastCallbackTimeDate) / hour > passiveSOSTime.value) {
                  performSOS = true;
                }
                break;
            }


            if (performSOS && !sosMessageSent) {
              // This acts like there is a need for an SOS notification.
              // eslint-disable-next-line max-len
              const TWILIO_FROM_PHONE_NUMBER = process.env.TWILIO_FROM_PHONE_NUMBER;
              const TWILIO_TO_PHONE_NUMBER = process.env.TWILIO_TO_PHONE_NUMBER;
              console.log("SOS");

              // eslint-disable-next-line max-len
              const message = "This is a message from ExploreSafe. At " + currentDate + "today, an automated SOS call was made from Jonathan's ExploreSafe app to alert listed contacts that Jonathan's device has been offline for <TIME>. Please do not be frightned, however, an unexpectedly long amount of time offline may indicate that Jonathan is trapped, lost, or otherwise missing. Please use the link below to access their location history.\nhttps://exploresafe-362903.firebaseapp.com/" + route;
              console.log(message);
              // Create Website with access to server
              // Send link to SMS

              twilioClient.messages
                  .create({
                    body: message,
                    to: TWILIO_TO_PHONE_NUMBER,
                    from: TWILIO_FROM_PHONE_NUMBER,
                  })
                  .then((message) => console.log(message.sid));

              const updateRef = db.ref("/routes/" + route + "/");

              updateRef.update({
                "sos_message_sent": true,
              });
            }
          }
        }
      });
    });
