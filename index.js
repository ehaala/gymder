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
	var key = '&key=AIzaSyCQH1Sui6szIjsZDawHKRqomT-5liiLJU4';
	var fullurl = url + city + key;
	request(fullurl, function(error, response, body) {
		var gym = JSON.parse(body).results;
		res.render('search', {gym: gym});
	})
})

app.get('/users', isLoggedIn, function(req, res) {
	db.user.findAll().then(function(users) {
		res.render('users', {users: users});
	})
})

app.get('/users/:id', isLoggedIn, function(req, res) {
	db.user.findOne({
		where: {id: req.params.id}
	}).then(function(user) {
		user.getGyms().then(function(gyms) {
			res.render('userinfo', {gyms: gyms, user: user});
		});
	})
})

app.get('/following', isLoggedIn, function(req, res) {
	db.user.findOne({
		where: {name: req.user.name}
	}).then(function(user) {
		user.getGyms().then(function(gyms) {
			res.render('following', {gyms: gyms});
		});
	})
})

app.post('/following', isLoggedIn, function(req, res) {
	db.user.find({
		where: {id: req.user.id}
	}).then(function(user) {
		db.gym.findOrCreate({
			where: {
				name: req.body.name,
				address: req.body.address
			}
		}).spread(function(gym, created) {
			user.addGym(gym).then(function(gym) {
				//
			})
		})
		res.redirect('/following');
	})
})

app.delete('/following/:id', isLoggedIn, function(req, res) {
	db.gym.destroy({
		where: {id: req.params.id}
	}).then(function() {
		//
	})
})

app.get('/following/:id', isLoggedIn, function(req, res) {
	db.gym.findOne({
		where: {id: req.params.id},
		include: [db.review]
	}).then(function(gym) {
		gym.getUsers().then(function(users) {
			res.render('gyminfo', {users: users, gym: gym});
		});
	})
})

app.post('/following/:id/reviews', function(req, res) {
	db.review.create({
		content: req.body.content,
		name: req.body.name,
		gymId: req.params.id
	}).then(function() {
		res.redirect('/following/' + req.params.id);
	})
})

app.get('/about', function(req, res) {
	res.render('about');
})

app.get('/profile', isLoggedIn, function(req, res) {
	res.render('profile', {user: req.user});
});

app.use('/auth', require('./controllers/auth'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
