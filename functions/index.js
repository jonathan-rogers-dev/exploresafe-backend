const functions = require("firebase-functions");
const admin = require("firebase-admin");
// eslint-disable-next-line max-len
const serviceAccount = require("./exploresafe-362903-firebase-adminsdk-asnln-e516bce95f.json");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

// Connection to Realtime Database
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://exploresafe-362903-default-rtdb.firebaseio.com",
});
const db = admin.database();
const ref = db.ref("/");

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  ref.once("value", (data) => {
    for (const route in data.val()) {
      if (route != null) {
        const routeData = data.val()[route];
        const routeID = routeData.route_id;
        const passiveSOSTime = routeData.passive_sos_time;
        const lastCallbackTime = routeData.last_callback_time;

        const placeholder = true;
        if (placeholder) {
          // This acts like there is a need for an SOS notification.
          console.log("SOS");
          client.messages
              .create({body: routeID, from: "+17174238730", to: "+19803584144"})
              .then((message) => console.log(message.sid));
        }

        // eslint-disable-next-line max-len
        console.log("Passive SOS: " + passiveSOSTime + " | Last Callback Time: " + lastCallbackTime);
      }
    }
    response.send(data.val());
  });
});


/*
exports.passiveSOSCheck = functions.pubsub.schedule("every 5 minutes")
    .onRun((context) => {
      console.log("This will be run every 5 minutes!");
      return null;
    });
*/
