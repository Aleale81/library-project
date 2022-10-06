// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");  // inside node folder

// ℹ️ Connects to the database
require("./db");  // equivalent to ./db/index.js inside the db directory

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);  // app is a function(that call express) that is exportes in the index.js file inside the config folder

//config sessions
require('./config/session.config')(app);

// default value for title local
const capitalized = require("./utils/capitalized");
const projectName = "library-project";

app.locals.appTitle = `${capitalized(projectName)} created with IronLauncher`;
app.use( (req, res, next) => {
    res.locals.userInSession = req.session.currentUser;
    next();
});

// 👇 Start handling routes here
 // whtever is in this file we?ll use it
app.use("/", require("./routes/index.routes"));

app.use("/", require("./routes/auth.routes"));

app.use("/", require("./routes/book.routes"));

app.use("/", require("./routes/author.routes"))

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
