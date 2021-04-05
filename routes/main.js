const express = require('express');
const { getRankings } = require('../controllers/main');
const {
  formatSyncDate,
  getTodaysWord,
  getTodaysWordArticleCount,
  getTodaysWordDescription,
  hasRankings,
} = require('../viewHelpers/viewHelpers');
const Metadata = require('../models/Metadata');

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
      hasRankings,
    },
  };

  res.render('homepage', { state });
});
app.get('/about', (req, res) => res.render('about'));

module.exports = app;
