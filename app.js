var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
//Configuración de la sesión
const sessionConfig = require("./config/sessionConfig");
const sessionInitializer = require("./middlewares/sessionInitializer");

//Configuracion de rutas
var indexRouter = require("./routes/index");
var loginRouter = require("./routes/loginRouters");
var usersRouter = require("./routes/usersRoutes");
var logoutRouter = require("./routes/logout");
var adminRouter = require("./routes/administrationRoutes");

var app = express();

app.use(sessionConfig);
app.use(sessionInitializer);
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
app.use("/users", usersRouter);
app.use("/logout", logoutRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404).render("error", { title: "Error" });
});

module.exports = app;
