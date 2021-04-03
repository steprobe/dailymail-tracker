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

    if (!keywords || articleMatcher(article, keywords)) {
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
    };

    if (!keywords || articleMatcher(article, keywords)) {
      results.push(article);
    }
  });

  return results;
};

const track = async () => {
  const response = await got('https://www.dailymail.co.uk/home/index.html');
  const $ = cheerio.load(response.body);

  // const res = await Keywords.findOne();
  // const keywords = res ? res.keywords : [];
  const keywords = null;

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

  console.log(`Saved ${results.length} articles`);
};

module.exports = track;
