const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./Models/db");

// Routers
const AuthRouter = require("./Routes/AuthRouter");
const QuestionsRouter = require("./Routes/QuestionsRouter");
const TrueFalseRouter = require("./Routes/TrueFalseRouter");
const FillBlankRouter = require("./Routes/FillBlankRouter");

const app = express();
const PORT = process.env.PORT || 8080;

// 1) Start permissive CORS for first deploy
app.use(cors()); // <-- TEMP: wide open to avoid CORS issues during setup
app.use(express.json());

// Health/base
app.get("/", (_req, res) => res.send("VTQuestion Bank API is running..."));

// Routes
app.use("/auth", AuthRouter);
app.use("/api/questions", QuestionsRouter);
app.use("/api/truefalse", TrueFalseRouter);
app.use("/api/fillblank", FillBlankRouter);

// Export app for Vercel / Listen locally
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`));
}
