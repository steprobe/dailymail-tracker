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
  res.render('admin/admin', await getState());
});

app.get('/admin/keywords', auth, async (req, res) => {
  res.render('admin/adminKeywords', await getState());
});

app.get('/admin/articles', auth, async (req, res) => {
  res.render('admin/adminArticles', await getState());
});

app.get('/admin/rankings', auth, async (req, res) => {
  res.render('admin/adminRankings', await getRankings());
});

app.post('/admin/sync', auth, async (req, res) => {
  await track();
  res.render('admin/admin', await getState());
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

module.exports = app;
