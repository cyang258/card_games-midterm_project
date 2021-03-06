"use strict";

require('dotenv').config();

const PORT          = process.env.PORT || 9090;
const ENV           = process.env.ENV || "development";
const express       = require("express");
const bodyParser    = require("body-parser");
const sass          = require("node-sass-middleware");
const app           = express();
const http          = require("http");
const cookieSession = require('cookie-session');
const ngrok         = require('ngrok');


const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Cookies
app.use(cookieSession({
  name: 'session',
  secret: process.env.COOKIE_SECRET,
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// Uncomment and change port to 8080 if using Ngrok domain
ngrok.connect(9090, function (err, url) {
  if(err) {
    console.log(err);
  };
  console.log(url);
});

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// Use Material Design Components
app.use("/styles", express.static(__dirname + '/node_modules/material-components-web/dist'));

app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));


// Use data helpers to interface with database
const DataHelpers = require("./lib/util/data_helpers")(knex);

// Mount all resource routes
app.use("/cards", usersRoutes(DataHelpers));

// Home page
app.get("/", (req, res) => {
  res.redirect("/cards");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

