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
        // eslint-disable-next-line no-unused-vars
        const passiveSOSTime = routeData.passive_sos_time;
        // eslint-disable-next-line no-unused-vars
        const lastCallbackTime = routeData.last_callback_time;

        const placeholder = false;
        if (placeholder) {
          // This acts like there is a need for an SOS notification.
          const TWILIO_FROM_PHONE_NUMBER = process.env.TWILIO_FROM_PHONE_NUMBER;
          const TWILIO_TO_PHONE_NUMBER = process.env.TWILIO_TO_PHONE_NUMBER;
          console.log("SOS");

          // eslint-disable-next-line max-len
          const message = "This is a message from ExploreSafe. At <TIME> today, an automated SOS call was made from Jonathan's ExploreSafe app to alert listed contacts that Jonathan's device has been offline for <TIME>. Please do not be frightned, however, an unexpectedly long amount of time offline may indicate that Jonathan is trapped, lost, or otherwise missing. Please use the link below to access their location history.\nhttps://exploresafe-362903.firebaseapp.com/active_route_id_0";

          // Create Website with access to server
          // Send link to SMS

          twilioClient.messages
              .create({
                body: message,
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
