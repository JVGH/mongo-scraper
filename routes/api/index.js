'use strict';
const apiRouter = require('express').Router();
const articleRouter = require('./article');
const postRouter = require('./post');

// Article Route
apiRouter.use('/articles', articleRouter);

// Post Route
apiRouter.use('/posts', postRouter);

module.exports = apiRouter;
