require('dotenv').config();
const express = require('express');
const listEndpoints = require('express-list-endpoints');
const connectToDb = require('./config/db');
const track = require('./jobs/track');

const app = express();

connectToDb();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('homepage');
});

app.get('/track', async (req, res) => {
  await track();
  res.send('there we go');
});

console.log(listEndpoints(app));

const port = process.env.NODE_ENV === 'test' ? 5001 : process.env.PORT || 5000;
app.listen(port, () => console.log(`Running on ${port}`));
