const session = require("express-session");
require("dotenv").config();

const sessionConfig = session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
});

module.exports = sessionConfig;
1