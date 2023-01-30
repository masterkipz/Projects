const express = require("express");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const path = require("path");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConnections");
const mongoose = require("mongoose");
const { logger, logEvents } = require("./middleware/logger");
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

// Prevent Mongoose Deprication error
mongoose.set('strictQuery', true);
connectDB();

app.use(logger);

app.use(express.json());

app.use(cookieParser());

app.use(cors(corsOptions));

app.use("/", express.static(path.join(__dirname, "public")));

// Website Routes
app.use("/", require("./routes/root"));
app.use('/users', require("./routes/userRoutes"));
app.use('/notes', require("./routes/noteRoutes"));

// Page for 404 error
app.all("*", (req, res, next) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views/404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// Log errors
app.use(errorHandler);

// Initialize Connection to Database
mongoose.connection.once("open", () => {
  console.log("Connected to mongoDB");
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
});

mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(`${err.no} : ${err.code}\t ${err.syscall}\t ${err.hostname}`, 'mongoErrLog.log');
})
