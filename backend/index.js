const express = require("express");
require("dotenv").config();
require("./Models/db");

// Import Routers (fix names properly)
const AuthRouter = require("./Routes/AuthRouter");
const QuestionsRouter = require("./Routes/QuestionsRouter");
const TrueFalseRouter = require("./Routes/TrueFalseRouter"); // 🔥 Capital "T"
const FillBlankRouter = require("./Routes/FillBlankRouter"); // 🔥 Capital "F"

const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(bodyParser.json()); // ✅ JSON Parser

// Base route
app.get("/", (req, res) => {
  res.send("VTQuestion Bank API is running...");
});

// Authentication Routes
app.use("/auth", AuthRouter);

// Questions Routes
app.use("/api/questions", QuestionsRouter);
app.use("/api/truefalse", TrueFalseRouter);
app.use("/api/fillblank", FillBlankRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
