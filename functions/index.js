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

exports.helloWorld = functions.https.onRequest((request, response) => {
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
          console.log("SOS");


          // Create Website with access to server
          // Send link to SMS

          twilioClient.messages
              .create({
                body: routeData,
                to: "+19803584144", // Text this number
                from: "+17174238730", // From a valid Twilio number
              })
              .then((message) => console.log(message.sid));
        }

        // eslint-disable-next-line max-len
        console.log("Passive SOS: " + passiveSOSTime + " | Last Callback Time: " + lastCallbackTime);
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
