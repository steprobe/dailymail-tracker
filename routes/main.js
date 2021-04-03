const express = require('express');
const { getRankings } = require('../controllers/main');

const app = express.Router();

app.get('/', async (req, res) => {
  const rankings = await getRankings();
  res.render('homepage', rankings);
});
app.get('/about', (req, res) => res.render('about'));

module.exports = app;
