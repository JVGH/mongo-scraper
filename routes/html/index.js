'use strict';
const htmlRouter = require('express').Router();
const articleRouter = require('./article');
const postRouter = require('./post');

// Article Route
htmlRouter.use('/articles', articleRouter);

// Post Route
htmlRouter.use('/posts', postRouter);

module.exports = htmlRouter;
