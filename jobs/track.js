const cheerio = require('cheerio');
const cache = require('memory-cache');
const got = require('got');
const Sentry = require('@sentry/node');
const Keywords = require('../models/Keyword');
const Article = require('../models/Article');
const MetaData = require('../models/Metadata');

const trim = (text) => text.replace(/^\s+|\s+$/g, '');

const assignKeywords = (article, keywords) => {
  keywords.forEach((keyword) => {
    const isMatch = keyword.matches.some(
      (word) =>
        article.headline &&
        article.headline.toLowerCase().includes(word.toLowerCase()),
    );

    if (isMatch) {
      article.matched.push(keyword);
    }
  });
};

const parseColumnOfShame = ($, keywords) => {
  // TODO: Map + filter
  const results = [];

  $('div.beta li').each((i, element) => {
    const article = {
      headline: trim($(element).find('span strong').text()),
      articleText: null,
      href: $(element).find('a:first').attr('href'),
      image: $(element).find('img').attr('data-src'),
      matched: [],
    };

    assignKeywords(article, keywords);
    if (!keywords || article.matched.length > 0) {
      results.push(article);
    }
  });

  return results;
};

const parseArticles = ($, keywords) => {
  // TODO: Map + filter
  const results = [];

  $('div.article').each((i, element) => {
    const candidate1 = $(element).find('.articletext p').text();
    const candidate2 = $(element).find('.articletext-holder p').text();
    const candidate3 = $(element).find('.articletext div p').text();

    const articleText = candidate1 || candidate2 || candidate3;

    const article = {
      headline: trim($(element).find('a:first').text()),
      articleText: trim(articleText),
      href: $(element).find('a').attr('href'),
      image: $(element).find('img').attr('data-src'),
      matched: [],
    };

    assignKeywords(article, keywords);
    if (!keywords || article.matched.length > 0) {
      results.push(article);
    }
  });

  return results;
};

const track = async () => {
  const response = await got('https://www.dailymail.co.uk/home/index.html');
  const $ = cheerio.load(response.body);

  const keywords = await Keywords.find({});

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

  cache.clear();

  Sentry.addBreadcrumb({
    message: `Articles Tracking finished with ${results.length} articles`,
  });
  console.log(`Saved ${results.length} articles`);
};

module.exports = track;
