require('dotenv').config();
const express = require('express');
const listEndpoints = require('express-list-endpoints');
const connectToDb = require('./config/db');

const app = express();

connectToDb();

app.use(
  '/bootstrap',
  express.static(`${__dirname}/node_modules/bootstrap/dist`),
);
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('homepage'));
app.get('/about', (req, res) => res.render('about'));
app.get('/alanjohnson', async (req, res) => res.render('admin'));

console.log(listEndpoints(app));

const port = process.env.NODE_ENV === 'test' ? 5001 : process.env.PORT || 5000;
app.listen(port, () => console.log(`Running on ${port}`));
