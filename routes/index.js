'use strict';
const router = require('express').Router();
const apiRouter = require('./api');
const htmlRouter = require('./html');
const menu = require('../models/menu');

/* GET home page */
router.get('/', (req, res, next) => {
	res.status(200).redirect(303, '/html/articles/topic/world');
});
/* router.get('/', (req, res, next) => {
	res.render('index', { title: 'Home', menu: menu });
}); */

// API Routes
router.use('/api', apiRouter);

// HTML Routes
router.use('/html', htmlRouter);

//Catch-all Route
router.get('*', (req, res) => {
	res.status(404).send({
		message: 'A Valid Req Not Found',
	});
});

module.exports = router;
