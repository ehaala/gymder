var express = require('express');
var db = require('../models');
var router = express.Router();

var isLoggedIn = require('../middleware/isLoggedIn');

router.get('/users', isLoggedIn, function(req, res) {
	db.user.findAll().then(function(users) {
		res.render('users', {users: users});
	})
})

router.get('/users/:id', isLoggedIn, function(req, res) {
	db.user.findOne({
		where: {id: req.params.id}
	}).then(function(user) {
		user.getGyms().then(function(gyms) {
			res.render('userinfo', {gyms: gyms, user: user});
		});
	})
})
