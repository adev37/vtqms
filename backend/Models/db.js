// Importing the mongoose library, which is used to interact with MongoDB from Node.js
const mongoose = require("mongoose");

// Fetching the MongoDB connection URL from environment variables (.env file)
// The connection string is stored in MONGO_CONN, and it typically contains the database URL with credentials
const mongo_url = process.env.MONGO_CONN;

// Using mongoose to connect to the MongoDB database using the connection URL
mongoose
  .connect(mongo_url)
  .then(() => {
    // If the connection is successful, this message is logged to the console
    console.log("mongodb connected...");
  })
  .catch((err) => {
    // If there is an error during the connection process, it will log the error message to the console
    console.log("mongodb connection error", err);
  });
