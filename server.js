// server.js

// set up ======================================================================
// get all the tools we need
require('dotenv').load();
var express = require('express');
var session = require('express-session');
var app = express();
var port = process.env.PORT || 8080;
var Ravelry = require('node-ravelry/src');

var morgan = require('morgan');
var bodyParser = require('body-parser');

var rav = new Ravelry({
    'ravAccessKey': process.env.ravAccessKey,
    'ravSecretKey': process.env.ravSecretKey,
    'ravPersonalKey': process.env.ravPersonalKey,
    'callbackUrl': 'http://localhost:8080/callback',
    'responseUrl': 'http://localhost:8080/protected/profile'
}, [
    'forum-write', 'message-write', 'patternstore-read', 'deliveries-read'
]);

// configuration ===============================================================
app.set('views', __dirname + '/public/views');
app.use(express.static(__dirname + '/public'));
// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: 'ssshhhhh',
    resave: 'false',
    saveUninitialized: 'false'
}));

var protectedRouter = new express.Router(); //use a router for our api routes that validates user is logged in
protectedRouter.use(function(req, res, next) { //validate for every call
    //make sure the user is authenticated. do this for all routes.
    if (req.session.user)
        return next();
    // if they aren't redirect them to the home page
    req.session.error = "You are not logged in!";
    res.redirect('/');
});

app.use('/protected', protectedRouter);
app.set('view engine', 'ejs'); // set up ejs for templating

// routes ======================================================================
require('./app/routes.js')(app, rav); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
