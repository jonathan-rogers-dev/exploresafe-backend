const functions = require("firebase-functions");
// const {initializeApp} = require( "firebase-admin/app");
const admin = require("firebase-admin");

// Fetch the service account key JSON file contents
// eslint-disable-next-line max-len
const serviceAccount = require("/Users/Jonat/Documents/GitHub/exploresafe-backend/functions/exploresafe-362903-firebase-adminsdk-asnln-e516bce95f.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // The database URL depends on the location of the database
  databaseURL: "https://exploresafe-362903-default-rtdb.firebaseio.com",
});

// eslint-disable-next-line max-len
// As an admin, the app has access to read and write all data, regardless of Security Rules
const db = admin.database();
const ref = db.ref("/"); // Gets root of the database


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});

  ref.once("value", function(snapshot) {
    const databaseData = snapshot.val();
    for (const index in databaseData) {
      if (databaseData[index] != null) {
        console.log(databaseData[index]);
      }
    }
  });

  response.send("Hello from Firebase!");
});

/*
exports.passiveSOSCheck = functions.pubsub.schedule("32 21 * * *")
    .timeZone("America/New_York")
    .onRun((context) => {
      console.log("This will be run every day at 11:05 AM Eastern!");
      return null; // This is important for some reason.
    });

    */


exports.passiveSOSCheck = functions.pubsub.schedule("every 5 minutes")
    .onRun((context) => {
      console.log("This will be run every 5 minutes!");
      return null;
    });
