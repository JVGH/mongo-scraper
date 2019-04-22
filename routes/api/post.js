'use strict';
const postRouter = require('express').Router();
const postController = require('../../Controller').post;

// Post End-points
postRouter
	.post('/', (req, res, next) => {
		postController
			.create(req.body)
			.then((data) =>
				data.length < 1
					? res.status(404).json({ message: `No Post Found` })
					: res.status(201).json(data),
			)
			.catch((err) => res.status(500).next(err));
	})
	.put('/like/:postId', (req, res, next) => {
		postController
			.incrementLike(req.params.postId)
			.then((data) =>
				data.length < 1
					? res.status(404).json({ message: `No Post Found` })
					: res.status(201).json(data),
			)
			.catch((err) => res.status(500).next(err));
	})
	.put('/:postId', (req, res, next) => {
		postController
			.updateById(req.params.postId, req.body)
			.then((data) =>
				data.length < 1
					? res.status(404).json({ message: `No Post Found` })
					: res.status(200).json(data),
			)
			.catch((err) => res.status(500).next(err));
	})
	.delete('/:postId', (req, res, next) => {
		postController
			.delete(req.params.postId)
			.then((data) =>
				data.length < 1
					? res.status(404).json({ message: `No Post Found` })
					: res.status(200).json(data),
			)
			.catch((err) => res.status(500).next(err));
	});

module.exports = postRouter;
