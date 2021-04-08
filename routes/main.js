const express = require('express');
const {
  getRankings,
  getKeywords,
  getMetadata,
} = require('../controllers/main');
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

const app = express.Router();

app.get('/', async (req, res) => {
  const rankings = await getRankings();
  const metadata = await getMetadata();

  const state = {
    rankings,
    metadata,
    analyticsId: process.env.G_ANALYTICS_ID,
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
  const keywords = await getKeywords();
  res.render('about', {
    state: {
      analyticsId: process.env.G_ANALYTICS_ID,
      keywords,
      helpers: {
        getTrackedWords,
      },
    },
  });
});

module.exports = app;
