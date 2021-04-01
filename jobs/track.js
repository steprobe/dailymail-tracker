const cheerio = require('cheerio');
const got = require('got');
const Keywords = require('../models/Keyword');
const Article = require('../models/Article');
const MetaData = require('../models/Metadata');

const trim = (text) => text.replace(/^\s+|\s+$/g, '');

const articleMatcher = (article, keywords) =>
  keywords.some(
    (keyword) =>
      (article.headline &&
        article.headline.toLowerCase().includes(keyword.toLowerCase())) ||
      (article.articleText &&
        article.articleText.toLowerCase().includes(keyword.toLowerCase())),
  );

const parseColumnOfShame = ($, keywords) => {
  // TODO: Map + filter
  const results = [];

  $('div.beta li').each((i, element) => {
    const article = {
      headline: trim($(element).find('span strong').text()),
      articleText: null,
      href: $(element).find('a:first').attr('href'),
      image: $(element).find('img').attr('data-src'),
    };

    if (articleMatcher(article, keywords)) {
      results.push(article);
    }
  });

  return results;
};

const parseArticles = ($, keywords) => {
  // TODO: Map + filter
  const results = [];

  $('div.article').each((i, element) => {
    const article = {
      headline: trim($(element).find('a:first').text()),
      articleText: trim($(element).find('.articletext p').text()),
      href: $(element).find('a').attr('href'),
      image: $(element).find('img').attr('data-src'),
    };

    if (articleMatcher(article, keywords)) {
      results.push(article);
    }
  });

  return results;
};

const track = async () => {
  const response = await got('https://www.dailymail.co.uk/home/index.html');
  const $ = cheerio.load(response.body);

  const res = await Keywords.findOne();
  const keywords = res ? res.keywords : [];

  const results = [
    ...parseArticles($, keywords),
    ...parseColumnOfShame($, keywords),
  ];

  await Article.deleteMany({});
  await Article.insertMany(results);

  await MetaData.deleteMany({});
  await MetaData.create({
    itemsSynced: results.length,
  });

  console.log(results);
};

module.exports = track;
