require('dotenv').config();
const express = require('express');
const { CronJob } = require('cron');
const listEndpoints = require('express-list-endpoints');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Sentry = require('@sentry/node');
const connectToDb = require('./config/db');
const track = require('./jobs/track');

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    environment: process.env.NODE_ENV,
    dsn: process.env.SENTRY_DNS,
    tracesSampleRate: 1.0,
  });
}

const app = express();

connectToDb();

app.use(Sentry.Handlers.requestHandler());
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

app.use(Sentry.Handlers.errorHandler());

console.log(listEndpoints(app));

const port = process.env.NODE_ENV === 'test' ? 5001 : process.env.PORT || 5000;
app.listen(port, () => console.log(`Running on ${port}`));

const everyMorning = '0 10 * * *';
const morningKeywordsSync = new CronJob(
  everyMorning,
  async () => {
    console.log(
      `Morning cron job to sync keywords is live :D ${new Date().toISOString()}`,
    );
    await track();
  },
  null,
  false,
  'Europe/Madrid',
);

morningKeywordsSync.start();
