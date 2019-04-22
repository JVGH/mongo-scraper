'use strict';
const articleRouter = require('express').Router();
const articleController = require('../../Controller').article;

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
			.then((data) =>
				data.length < 1
					? res.status(404).json({ message: `No Article Found` })
					: res.status(200).json(data),
			)
			.catch((err) => res.status(500).next(err));
	})
	.get('/topic/:topic', (req, res, next) => {
		const query = {};
		query.topic = req.params.topic;
		articleController
			.fetchAll(query)
			.then((data) =>
				data.length < 1
					? res.status(404).send('No Article Found')
					: res.status(200).json(data),
			)
			.catch((err) => res.status(500).next(err));
	})
	.get('/scrape/:topic', (req, res, next) => {
		articleController
			.scrapeAndBulkInsert(req.params.topic)
			.then((data) =>
				data.length < 1
					? res.status(404).json({ message: `No Article Found` })
					: res.status(200).json(data),
			)
			.catch((err) => res.status(500).next(err));
	})
	.get('/:articleId', (req, res, next) => {
		articleController
			.fetchById(req.params.articleId)
			.then((data) =>
				data.length < 1
					? res.status(404).json({ message: `No Article Found` })
					: res.status(200).json(data),
			)
			.catch((err) => res.status(500).next(err));
	})
	.put('/toggleIsLiked/:articleId', (req, res, next) => {
		articleController
			.toggleIsLiked(req.params.articleId)
			.then((data) =>
				data.length < 1
					? res.status(404).json({ message: `No Article Found` })
					: res.status(200).json(data),
			)
			.catch((err) => res.status(500).next(err));
	})
	.put('/:articleId', (req, res, next) => {
		articleController
			.updateById(req.params.articleId, req.body)
			.then((data) =>
				data.length < 1
					? res.status(404).json({ message: `No Article Found` })
					: res.status(200).json(data),
			)
			.catch((err) => res.status(500).next(err));
	})
	.patch('/:articleId', (req, res, next) => {
		articleController
			.updateByKey(req.params.articleId, req.body)
			.then((data) =>
				data.length < 1
					? res.status(404).json({ message: `No Article Found` })
					: res.status(200).json(data),
			)
			.catch((err) => res.status(500).next(err));
	})
	.delete('/:articleId', (req, res, next) => {
		articleController
			.delete(req.params.articleId)
			.then((data) =>
				data.length < 1
					? res.status(404).json({ message: `No Article Found` })
					: res.status(200).json(data),
			)
			.catch((err) => res.status(500).next(err));
	});

module.exports = articleRouter;
