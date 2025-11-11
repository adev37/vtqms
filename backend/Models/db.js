const mongoose = require("mongoose");

const mongo_url = process.env.MONGO_CONN;

mongoose
  .connect(mongo_url)
  .then(() => console.log("mongodb connected..."))
  .catch((err) => console.error("mongodb connection error", err));

module.exports = mongoose;
