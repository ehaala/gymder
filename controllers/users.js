var express = require('express');
var db = require('../models');
var router = express.Router();

var isLoggedIn = require('../middleware/isLoggedIn');

router.get('/', isLoggedIn, function(req, res) {
	db.user.findAll().then(function(users) {
		res.render('users', {users: users});
	})
})

router.get('/:id', isLoggedIn, function(req, res) {
	db.user.findOne({
		where: {id: req.params.id},
		include: [db.schedule]
	}).then(function(user) {
		user.getGyms().then(function(gyms) {
			res.render('userinfo', {gyms: gyms, user: user});
		});
	})
})

router.post('/:id/schedule', isLoggedIn, function(req, res) {
	db.schedule.create({
		day: req.body.day,
		time: req.body.time,
		userId: req.user.id
	}).then(function() {
		res.redirect('/profile');
	});
})

router.delete('/:id/schedule/:id', isLoggedIn, function(req, res) {
	db.schedule.destroy({
		where: {
			id: req.params.id,
		}
	}).then(function() {
		//
	})
})

module.exports = router;