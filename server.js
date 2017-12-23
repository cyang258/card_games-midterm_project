"use strict";

require('dotenv').config();

const PORT          = process.env.PORT || 8080;
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

// Testing with other users
// ngrok.connect(9090, function (err, url) {
//   if(err) {
//     console.log(err);
//   };
//   console.log(url);
// });

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
// const server      = require("http").createServer(app);
// const io          = require("socket.io").listen(server);

// var users = [];
// var connections = [];
// var rooms = [];



// io.on('connection', function(socket) {

//   // if(req.session.userId) {
//   //   io.engine.generateId = (req) => {
//   //     return "custom:id:" + req.session.userId;
//   //   };
//   // }
//   //create room
//   socket.on("createRoom", function(room){

//       socket.join(room);
//       io.of('/').in(room).clients((error, clients) => {
//          if (error) throw error;
//          console.log(clients);
//       });

//   })
//   console.log(io.sockets.adapter.rooms);

//   //join a room
//   socket.on("join_A_Room", function(roomNumber){
//       socket.join(roomNumber);
//       console.log(io.sockets.adapter.rooms[roomNumber].length)
//       io.of('/').in(roomNumber).clients((error, clients) => {
//       if (error) throw error;
//         console.log(clients);
//       });
//   })


//   //How many people connected
//   connections.push(socket);
//   console.log('Connected: %s sockets connected', connections.length)

//   // Disconnect
//   socket.on('disconnect', function(data){
//     connections.splice(connections.indexOf(socket), 1);
//     console.log('Disconnected: %s sockets connected', connections.length)
//   })

//   socket.on('send message', function(data){
//     console.log(data);
//     io.emit('new message', data);
//   })
// })


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

