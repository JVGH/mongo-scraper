'use strict';
//Import Model
const db = require('../models');

// Defining methods for the Post Controller
module.exports = {
	create: async (body) => {
		try {
			const post = await new db.Post(body);
			const dbPost = await post
				.save()
				.then((post) => {
					return db.Article.findById(post.article).then((article) => {
						article.posts.push(post);
						return article.save();
					});
				})
				.then((data) => data);
			return dbPost;
		} catch (err) {
			return err;
		}
	},
	updateById: async (id, body) => {
		try {
			const dbPost = await db.Post.findOneAndUpdate({ _id: id }, body).then(
				(data) => data,
			);
			return dbPost;
		} catch (err) {
			return err;
		}
	},
	incrementLike: async (id) => {
		try {
			const dbPost = await db.Post.likePost(id).then((data) => data);
			return dbPost;
		} catch (err) {
			return err;
		}
	},
	delete: async (id) => {
		try {
			const dbPost = await db.Post.findByIdAndRemove(id)
				.then((post) => {
					return db.Article.findById(post.article).then((article) => {
						article.posts.pull(post);
						return article.save();
					});
				})
				.then((data) => data);
			return dbPost;
		} catch (err) {
			return err;
		}
	},
};
