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
        const routeData = data.val()[route];
        // const routeID = routeData.route_id;
        const passiveSOSTime = routeData.passive_sos_time;
        const lastCallbackTime = routeData.last_callback_time;

        const placeholder = true;
        if (placeholder) {
          // This acts like there is a need for an SOS notification.
          const TWILIO_FROM_PHONE_NUMBER = process.env.TWILIO_FROM_PHONE_NUMBER;
          const TWILIO_TO_PHONE_NUMBER = process.env.TWILIO_TO_PHONE_NUMBER;
          console.log("SOS");


          // Create Website with access to server
          // Send link to SMS

          twilioClient.messages
              .create({
                body: "Hello There",
                to: TWILIO_TO_PHONE_NUMBER, // Text this number
                from: TWILIO_FROM_PHONE_NUMBER, // From a valid Twilio number
              })
              .then((message) => console.log(message.sid));
        }
      }
    }
    response.send("Hi");
  });
});


/*
exports.passiveSOSCheck = functions.pubsub.schedule("every 5 minutes")
    .onRun((context) => {
      console.log("This will be run every 5 minutes!");
      return null;
    });
*/
