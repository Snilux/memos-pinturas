var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var loginRouter = require("./routes/login");
var recoveryPassRouter = require("./routes/recoveryPass");
var authRouter = require("./routes/auth");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/auth", authRouter);
app.use("/recoveryPass", recoveryPassRouter);

// catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404).send("Página no encontrada");
});
module.exports = app;
