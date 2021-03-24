const cheerio = require('cheerio');
const got = require('got');

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

  const keywords = ['Hilary', 'Jesy'];

  const results = [
    ...parseArticles($, keywords),
    ...parseColumnOfShame($, keywords),
  ];

  console.log(results);
};

module.exports = track;
