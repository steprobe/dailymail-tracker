const express = require('express');
const { getRankings } = require('../controllers/main');
const {
  formatSyncDate,
  getTodaysWord,
  getTodaysWordArticleCount,
  getTodaysWordDescription,
  getDisplayArticles,
  getTodaysWordRunnersUp,
  getTrackedWords,
  hasRankings,
} = require('../viewHelpers/viewHelpers');
const Metadata = require('../models/Metadata');
const Keyword = require('../models/Keyword');

const app = express.Router();

app.get('/', async (req, res) => {
  const rankings = await getRankings();
  const metadata = await Metadata.findOne({});

  const state = {
    rankings,
    metadata,
    helpers: {
      formatSyncDate,
      getTodaysWord,
      getTodaysWordArticleCount,
      getTodaysWordDescription,
      getDisplayArticles,
      getTodaysWordRunnersUp,
      hasRankings,
    },
  };

  res.render('home', { state });
});
app.get('/about', async (req, res) => {
  const keywords = await Keyword.find({});
  res.render('about', {
    state: {
      keywords,
      helpers: {
        getTrackedWords,
      },
    },
  });
});

module.exports = app;
