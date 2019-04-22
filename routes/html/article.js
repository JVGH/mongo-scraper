'use strict';
const articleRouter = require('express').Router();
const articleController = require('../../Controller').article;
const menu = require('../../models/menu');

const getOptions = (topic) => {
	menu.forEach((option) => (option.class = ''));
	menu.find((option) => option.topic === topic).class = 'is-active';
	return menu;
};

// Article End-points
articleRouter
	.get('/', (req, res, next) => {
		const query = {};
		if (req.query.topic) {
			query.topic = req.query.topic;
		}
		if (req.query.title) {
			query.title = new RegExp(req.query.title, 'i');
		}
		if (req.query.author) {
			query.author = new RegExp(req.query.author, 'i');
		}
		if (req.query.publishedOnDate) {
			query.publishedOnDate = req.query.publishedOnDate;
		}
		if (req.query.isLiked) {
			query.isLiked = req.query.isLiked;
		}
		articleController
			.fetchAll(query)
			.then((data) => res.status(200).render('index', { data }))
			.catch((err) => res.status(500).next(err));
	})
	.get('/topic/:topic', (req, res, next) => {
		const query = {};
		query.topic = req.params.topic;
		articleController
			.fetchAll(query)
			.then((data) =>
				res.status(200).render('index', {
					data,
					menu: getOptions(req.params.topic),
				}),
			)
			.catch((err) => res.status(500).next(err));
	})
	.get('/scrape/:topic', (req, res, next) => {
		articleController
			.scrapeAndBulkInsert(req.params.topic)
			.then((data) =>
				res
					.status(200)
					.redirect(303, `/html/articles/topic/${req.params.topic}`),
			)
			.catch((err) => res.status(500).next(err));
	});

module.exports = articleRouter;
