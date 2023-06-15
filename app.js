var createError = require("http-errors");
var express = require("express");
const cors = require('cors');
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");

require("dotenv").config();
const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("MongoDB Connected...");
    await migrate(); // This will run all migrations
  })
  .catch((err) => console.error("Failed to connect to database", err));

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const lessonsRouter = require("./routes/lessons");
const challengesRouter = require("./routes/challenges");
const authRouter = require("./routes/auth");
const symbolsRoutes = require("./routes/symbols");
const leaderboardRoutes = require("./routes/leaderboard");
const statsRoutes = require("./routes/stats");

const migrate = require("./migration/migrate");

var app = express();
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/lessons", lessonsRouter);
app.use("/challenges", challengesRouter);
app.use("/auth", authRouter);
app.use("/symbols", symbolsRoutes);
app.use("/stats", statsRoutes);
app.use('/leaderboard', leaderboardRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
