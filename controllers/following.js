var express = require('express');
var db = require('../models');
var router = express.Router();

var isLoggedIn = require('../middleware/isLoggedIn');

router.get('/', isLoggedIn, function(req, res) {
	db.user.findOne({
		where: {name: req.user.name}
	}).then(function(user) {
		user.getGyms().then(function(gyms) {
			res.render('following', {gyms: gyms});
		});
	})
})

router.post('/', isLoggedIn, function(req, res) {
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
				res.redirect('/following');
			})
		})
	})
})

router.delete('/:id', isLoggedIn, function(req, res) {
	db.usersGyms.destroy({
		where: {
			gymId: req.params.id,
			userId: req.user.id
		}
	}).then(function() {
		//
	})
})

router.get('/:id', isLoggedIn, function(req, res) {
	db.gym.findOne({
		where: {id: req.params.id},
		include: [db.review]
	}).then(function(gym) {
		gym.getUsers().then(function(users) {
			res.render('gyminfo', {users: users, gym: gym});
		});
	})
})

router.post('/:id/reviews', function(req, res) {
	db.review.create({
		content: req.body.content,
		name: req.body.name,
		gymId: req.params.id
	}).then(function() {
		res.redirect('/following/' + req.params.id);
	})
})

module.exports = router;