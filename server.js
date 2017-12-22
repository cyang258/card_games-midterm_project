"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();
const http        = require("http")


const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");


// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Use data helpers to contact db
const DataHelpers = require("./lib/util/data_helpers")(knex);


// Mount all resource routes
app.use("/cards", usersRoutes(DataHelpers));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

//Set up socket.io connection
const server      = require("http").createServer(app);
const io          = require("socket.io").listen(server);

var users = [];
var connections = [];



io.on('connection', function(socket) {

  connections.push(socket);
  console.log(io)

  console.log('Connected: %s sockets connected', connections.length)

  // Disconnect
  socket.on('disconnect', function(data){
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length)
  })
})


server.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

