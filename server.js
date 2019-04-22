'use strict';
// Module dependencies
//-- Requires
const path = require('path'),
	express = require('express'),
	bodyParser = require('body-parser'),
	exphbs = require('express-handlebars'),
	mongoose = require('mongoose'),
	cookieParser = require('cookie-parser'),
	createError = require('http-errors'),
	logger = require('morgan');

//-- Local Modules
const indexRouter = require('./routes');

// Init Express App
const app = express();

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Support JSON encoded bodies Post
app.use(bodyParser.json());
// Support encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Path Routing
app.use('/', indexRouter);

// View Engine (Handlebars) Setup
app.set('views', path.join(__dirname, 'views'));
app.engine(
	'handlebars',
	exphbs({
		defaultLayout: 'main',
		helpers: require('./lib/handlebars-helpers').helpers,
		// with the client-side of the app (see below).
		partialsDir: __dirname + '/views/partials/',
	}),
);
app.set('view engine', 'handlebars');

// DB (Mongo/Mongoose) Connection Setup
const MONGODB_URI =
	process.env.MONGODB_URI || 'mongodb://localhost:27017/nytScraper';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Default DB Connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Catch 404 And Forward to Error Handler
app.use(function(req, res, next) {
	next(createError(404));
});

// Error Handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
