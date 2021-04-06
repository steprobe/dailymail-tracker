const express = require('express');
const auth = require('../middleware/auth');
const track = require('../jobs/track');
const { getRankings } = require('../controllers/main');
const {
  getState,
  login,
  logout,
  saveKeywords,
} = require('../controllers/admin');

const app = express.Router();

app.get('/superhans', (req, res) =>
  res.render('admin/adminLogin', { failed: false }),
);
app.post('/superhans/login', (req, res) => login(req, res));
app.post('/superhans/logout', (req, res) => logout(req, res));

app.get('/admin', auth, async (req, res) => {
  const state = await getState();
  res.render('admin/admin', { state });
});

app.get('/admin/keywords', auth, async (req, res) => {
  const state = await getState();
  res.render('admin/adminKeywords', { state });
});

app.get('/admin/articles', auth, async (req, res) => {
  const state = await getState();
  res.render('admin/adminArticles', { state });
});

app.get('/admin/rankings', auth, async (req, res) => {
  const rankings = await getRankings();
  res.render('admin/adminRankings', { state: { rankings } });
});

app.post('/admin/sync', auth, async (req, res) => {
  await track();
  res.redirect('/admin');
});
app.post('/admin/saveKeywords', auth, async (req, res) => {
  try {
    await saveKeywords(req.body);
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }

  return res.redirect('/admin/keywords');
});

app.get('/admin/healthcheck', async (req, res) =>
  res.status(200).json({
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    usage: `${process.memoryUsage().heapTotal / (1024 * 1024)} MB`,
  }),
);

module.exports = app;
