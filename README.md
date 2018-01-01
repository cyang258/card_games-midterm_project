# Goofpield (& Hearts) Card Game

## Description

Hosts a webpage where users can play games of Goofspiel or Hearts against other users. Users can also see rankings for each type of game and a users game history. 

Currently games cannot be deleted and only five active games (either in lobby or started) can be played at once. Once a game is finished it will be removed from active games.

Goofpiel and Hearts games will start when 2 and 4 players enter the lobby, respectively.

## Screenshots

Homepage

!["Homepage"](https://github.com/cyang258/card_games-midterm_project/blob/master/docs/index.png?raw=true)

Games Page

!["The active games page"](https://github.com/cyang258/card_games-midterm_project/blob/master/docs/games.png?raw=true)

Games Rankings

!["Rankings for each game type based on total wins"](https://github.com/cyang258/card_games-midterm_project/blob/master/docs/rankings.png?raw=true)

User History

!["A users game history"](https://github.com/cyang258/card_games-midterm_project/blob/master/docs/user-history.png?raw=true)

## Getting Started

1. Download, clone or fork the repo
2. Run `npm install` to install dependencies
3. Create a database to store user and game information
  - Install and configure PostgreSQL and connect to the server, the use the following commands to create the necessary databases
  - `CREATE ROLE <username> WITH LOGIN password '<username>';`
  - `CREATE DATABASE <database_name> OWNER <username>;`
4. Create a `.env` file and add the following info
  - "DB_HOST=localhost"
  - "DB_USER=<username>"
  - "DB_PASS=<username>"
  - "DB_NAME=<database_name>"
  - "DB_PORT=5432"
  - "COOKIE_SECRET=<some_string>"
5. Install dependencies: `npm i`
6. Run migrations: `npm run knex migrate:latest`
7. Run the seed: `npm run knex seed:run`
  - You can add users to the seed to enable a registration of sorts
8. Run the server: `npm run local`
9. Visit `http://localhost:8080/`

## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above
- Body Parser
- Cookie Session
- Dotenv - database and cookie parameters
- EJS
- Express
- Knex - database CRUD operations
- Node SASS Middleware - serving CSS files from SASS
- PG - PostgreSQL client

## Dev Dependencies
- Nodemon
- Ngrok - ngrok provides domain for hosting
