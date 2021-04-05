require('dotenv').config();
const express = require('express');
const listEndpoints = require('express-list-endpoints');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connectToDb = require('./config/db');

const app = express();

connectToDb();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  '/bootstrap',
  express.static(`${__dirname}/node_modules/bootstrap/dist`),
);
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use('/', require('./routes/main'));
app.use('/', require('./routes/admin'));

console.log(listEndpoints(app));

const port = process.env.NODE_ENV === 'test' ? 5001 : process.env.PORT || 5000;
app.listen(port, () => console.log(`Running on ${port}`));
