'use strict';
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

//Generate Schema
const postSchema = new Schema({
	postText: { type: String, required: true },
	author: { type: String, uppercase: true, default: 'Anon', index: true },
	likeCount: { type: Number, min: 0, default: 0 },
	postedOnDate: { type: Date, required: true, default: Date.now },
	article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
});

//Add helper fxs
// Statics
postSchema.statics.likePost = async function(id) {
	try {
		const dbPost = await this.findByIdAndUpdate(
			id,
			{
				$inc: { likeCount: 1 },
			},
			{ new: true },
		).then((data) => data);
		return dbPost;
	} catch (err) {
		return err;
	}
};

//Set schema to variable
const Post = mongoose.model('Post', postSchema);

//Export
module.exports = Post;
