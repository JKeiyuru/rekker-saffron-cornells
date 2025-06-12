const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Your downloaded file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nemmoh-ecommerce.firebaseio.com",
});

module.exports = admin;