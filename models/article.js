'use strict';
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

//Generate Schema
const articleSchema = new Schema({
	topic: { type: String, required: true },
	title: { type: String, required: true },
	summary: { type: String, required: true },
	author: { type: String, required: true, uppercase: true, index: true },
	articleURL: { type: String, required: true },
	imageURL: {
		type: String,
		default: 'https://via.placeholder.com/210x140',
	},
	publishedOnDate: { type: Date, required: true },
	isLiked: { type: Boolean, required: true, default: false },
	likedOnDate: { type: Date },

	//FK : 1-to-Many
	posts: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Post',
			index: true,
		},
	],
});

//Add helper fxs
// Statics
articleSchema.statics.findByIdAndToggleIsLiked = async function(id) {
	try {
		const dbArticle = await this.findById(id)
			.then((article) => {
				article.isLiked = !article.isLiked;
				article.save();
				return article;
			})
			.then((data) => data);
		return dbArticle;
	} catch (err) {
		return err;
	}
};

// Pre-Remove middleware
articleSchema.pre('remove', async function(next) {
	try {
		await this.model('Post')
			.remove({ _id: { $in: this.posts } })
			.then((data) => data);
		next();
	} catch (err) {
		next(err);
	}
});

//Define Indexes
articleSchema.index({ topic: 1, title: 1 }, { unique: true });

//Set schema to variable
const Article = mongoose.model('Article', articleSchema);

//Export
module.exports = Article;
