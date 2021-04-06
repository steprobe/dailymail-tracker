const jwt = require('jsonwebtoken');

const Article = require('../models/Article');
const Metadata = require('../models/Metadata');
const Keyword = require('../models/Keyword');

exports.saveKeywords = async (form) => {
  await Keyword.deleteMany({});

  if (Array.isArray(form.newKeywordName)) {
    const objects = [];
    for (let i = 0; i < form.newKeywordName.length; i += 1) {
      if (form.newKeywordName[i] && form.newKeywordDescription[i]) {
        objects.push({
          matches: form.newKeywordName[i].split(','),
          description: form.newKeywordDescription[i],
        });
      }
    }

    await Keyword.create(objects);
  } else if (form.newKeywordName && form.newKeywordDescription) {
    await Keyword.create({
      matches: form.newKeywordName.split(','),
      description: form.newKeywordDescription,
    });
  }
};

exports.getState = async () => {
  const keywords = await Keyword.find({});
  const articles = await Article.find({});
  const metadata = await Metadata.findOne({});

  return {
    keywords,
    articles,
    metadata,
  };
};

exports.login = async (req, res) => {
  if (
    req.body.username === process.env.ADMIN_USER &&
    req.body.password === process.env.ADMIN_PASSWORD
  ) {
    const payload = { user: 'lordoftherings' };
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '5 days',
    });

    res.cookie('token', token);
    res.redirect('/admin');
  } else {
    res.render('admin/adminLogin', { failed: true });
  }
};

exports.logout = async (req, res) => {
  res.cookie('token', '');
  res.redirect('/superhans');
};
