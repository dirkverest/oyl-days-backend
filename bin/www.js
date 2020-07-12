require("dotenv").config();
// Module dependencies.
const app = require("../app");
const mysqlConnection = require("../data/dbConnectors");
const seed = require("../data/seed");
// JavaScript debugging utility
const debug = require("debug")("oyl-days-backend:server");
const http = require("http");
// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || "4000");

app.set("port", port);
console.log(`App running on port: ${port}`);

// Create HTTP server.
const server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

// SQL Check mysql connection
mysqlConnection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log(
    `Connected to mysql database with id: ${mysqlConnection.threadId}`
  );
});

// Check for database tables
if (process.env.ENVIRONMENT === "dev") {
  mysqlConnection.query(
    {
      sql: `SHOW TABLES LIKE 'User';`,
      timeout: 4000,
    },
    (err, results) => {
      if (results.length === 0) {
        seed.tables();
        seed.data();
        console.log("Seeded tables and dummy data.");
      } else if (err) {
        console.error("Error creating tables: " + err.stack);
        return;
      }
    }
  );
}

// Normalize a port into a number, string, or false.
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

// Event listener for HTTP server "error" event.
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

//  Event listener for HTTP server "listening" event.
function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
