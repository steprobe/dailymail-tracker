require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const listEndpoints = require('express-list-endpoints');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');
const connectToDb = require('./config/db');
const track = require('./jobs/track');

const Article = require('./models/Article');
const Metadata = require('./models/Metadata');
const Keyword = require('./models/Keyword');

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

const saveKeywords = async (form) => {
  await Keyword.deleteMany({});

  if (Array.isArray(form.newKeywordName)) {
    const objects = [];
    for (let i = 0; i < form.newKeywordName.length; i += 1) {
      if (
        form.newKeywordName[i] &&
        form.newKeywordType[i] &&
        form.newKeywordDescription[i]
      ) {
        objects.push({
          keyword: form.newKeywordName[i],
          type: form.newKeywordType[i],
          description: form.newKeywordDescription[i],
        });
      }
    }

    await Keyword.create(objects);
  } else if (
    form.newKeywordName &&
    form.newKeywordType &&
    form.newKeywordDescription
  ) {
    await Keyword.create({
      keyword: form.newKeywordName,
      type: form.newKeywordType,
      description: form.newKeywordDescription,
    });
  }
};

const getState = async () => {
  const keywords = await Keyword.find({});
  return {
    keywords,
  };
};

const login = async (req, res) => {
  if (
    req.body.username === process.env.ADMIN_USER &&
    req.body.password === process.env.ADMIN_PASSWORD
  ) {
    const payload = { user: 'lordoftherings' };
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '5 days',
    });

    res.cookie('token', token);
    res.redirect('/alanjohnson');
  } else {
    res.render('adminLogin', { failed: true });
  }
};

const logout = async (req, res) => {
  res.cookie('token', '');
  res.redirect('/superhans');
};

app.get('/', (req, res) => res.render('homepage'));
app.get('/about', (req, res) => res.render('about'));
app.get('/superhans', (req, res) =>
  res.render('adminLogin', { failed: false }),
);
app.post('/superhans/login', (req, res) => login(req, res));
app.post('/superhans/logout', (req, res) => logout(req, res));
app.get('/alanjohnson', auth, async (req, res) => {
  res.render('admin', await getState());
});
app.post('/alanjohnson/sync', auth, async (req, res) => {
  await track();
  res.render('admin', await getState());
});
app.post('/alanjohnson/saveKeywords', auth, async (req, res) => {
  try {
    await saveKeywords(req.body);
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }

  return res.redirect('/alanjohnson');
});

console.log(listEndpoints(app));

const port = process.env.NODE_ENV === 'test' ? 5001 : process.env.PORT || 5000;
app.listen(port, () => console.log(`Running on ${port}`));
