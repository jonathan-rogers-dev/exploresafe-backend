const functions = require("firebase-functions");


const admin = require("firebase-admin");


// eslint-disable-next-line max-len
const serviceAccount = require("./exploresafe-362903-firebase-adminsdk-asnln-e516bce95f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://exploresafe-362903-default-rtdb.firebaseio.com",
});


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const db = admin.database();
const ref = db.ref("/");

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  ref.once("value", (data) => {
    console.log(data.active_route_id_0.user_id);
    response.send(data.active_route_id_0.user_id);
  });
});


/*
exports.passiveSOSCheck = functions.pubsub.schedule("every 5 minutes")
    .onRun((context) => {
      console.log("This will be run every 5 minutes!");
      return null;
    });
*/
