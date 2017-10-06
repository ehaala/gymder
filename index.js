require('dotenv').config();
var express = require('express');
var request = require('request');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var db = require('./models');

var session = require('express-session');
var flash = require('connect-flash');
var isLoggedIn = require('./middleware/isLoggedIn');

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

app.use(function(req, res, next) {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

//these lines MUST occur after the session is configured
var passport = require('./config/ppConfig');
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
	res.render('home');
});

app.post('/search', function(req, res) {
	var url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=gyms+in+';
	var city = req.body.city;
	var key = '&key='+ process.env.GOOGLE_KEY;
	var fullurl = url + city + key;
	request(fullurl, function(error, response, body) {
		var gym = JSON.parse(body).results;
		res.render('search', {gym: gym});
	})
})

app.get('/about', function(req, res) {
	res.render('about');
})

app.get('/profile', isLoggedIn, function(req, res) {
	db.user.findOne({
		where: {id: req.user.id},
		include: [db.schedule]
	}).then(function(user) {
		user.getSchedules().then(function(schedule) {
			res.render('profile', {schedule: schedule, user: user});
		});
	})
});

app.use('/following', require('./controllers/following'));
app.use('/users', require('./controllers/users'));
app.use('/auth', require('./controllers/auth'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
