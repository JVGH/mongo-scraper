'use strict';
//Import Model
const db = require('../models');
const nytScraper = require('../utils/nytScraper');

// Defining methods for the Article Controller
module.exports = {
	scrapeAndBulkInsert: async (topic) => {
		try {
			const scraper = await nytScraper
				.nytScraper(topic)
				.then((scrapedData) => scrapedData);
			const addProps = async (data) => {
				return data.map((obj) => {
					obj.topic = topic;
					obj.isLiked = false;
					return obj;
				});
			};
			const scraperArray = await addProps(scraper).then((data) => data);
			const dbArticles = await db.Article.insertMany(scraperArray, {
				ordered: false,
			}).then((data) => data);
			return dbArticles;
		} catch (err) {
			return err;
		}
	},
	fetchAll: async (query) => {
		try {
			const dbArticles = await db.Article.find(query)
				.sort({
					publishedOnDate: -1,
				})
				.then((data) => data);
			return dbArticles;
		} catch (err) {
			return err;
		}
	},
	fetchById: async (id) => {
		try {
			const dbArticle = await db.Article.findById(id)
				.populate('posts')
				.then((data) => data);
			return dbArticle;
		} catch (err) {
			return err;
		}
	},
	updateById: async (id, body) => {
		try {
			const dbArticle = await db.Article.findOneAndUpdate(
				{ _id: id },
				body,
			).then((data) => data);
			return dbArticle;
		} catch (err) {
			return err;
		}
	},
	updateByKey: async (id, body) => {
		try {
			if (body._id) {
				await delete body._id;
			}
			const dbArticle = await db.Article.findById(id).then((data) => data);

			const query = { $set: {} };
			const constQuery = async (data) => {
				for (const key of data) {
					if (dbArticle[key] && dbArticle[key] !== data[key])
						query.$set[key] = data[key];
				}
				return query;
			};

			const queryBuilt = await constQuery(body).then((data) => data);

			const dbArticleUpd = await dbArticle
				.findOneAndUpdate({ _id: id }, queryBuilt)
				.then((data) => data);
			return dbArticleUpd;
		} catch (err) {
			return err;
		}
	},
	toggleIsLiked: async (id) => {
		try {
			const dbArticle = await db.Article.findByIdAndToggleIsLiked(id).then(
				(data) => data,
			);
			return dbArticle;
		} catch (error) {
			return err;
		}
	},
	delete: async (id) => {
		try {
			const dbArticleFind = await db.Article.findById(id).then((data) => data);
			const dbArticle = await dbArticleFind.remove().then((data) => data);
			return dbArticle;
		} catch (err) {
			return err;
		}
	},
};
