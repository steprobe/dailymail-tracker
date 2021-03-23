const cheerio = require('cheerio');
const got = require('got');

const trim = (text) => text.replace(/^\s+|\s+$/g, '');

const parseLargeArticles = ($) => {
  const results = [];

  $('div.article.article-large').each((i, element) => {
    results.push({
      headline: trim($(element).find('a:first').text()),
      articleText: trim($(element).find('p').text()),
      href: $(element).find('a:first').attr('href'),
      image: $(element).find('img').attr('data-src'),
    });
  });

  return results;
};
const parseColumnOfShame = ($) => {
  const results = [];

  $('div.femail.item li').each((i, element) => {
    results.push({
      headline: trim($(element).find('span strong').text()),
      articleText: null,
      href: $(element).find('a:first').attr('href'),
      image: $(element).find('img').attr('data-src'),
    });
  });

  return results;
};

const parseSmallArticles = ($) => {
  const results = [];

  $('div.article.article-small').each((i, element) => {
    results.push({
      headline: trim($(element).find('a:first').text()),
      articleText: trim($(element).find('.articletext p').text()),
      href: $(element).find('a').attr('href'),
      image: $(element).find('img').attr('data-src'),
    });
  });

  return results;
};

const track = async () => {
  const response = await got('https://www.dailymail.co.uk/home/index.html');
  const $ = cheerio.load(response.body);

  const results = [
    ...parseSmallArticles($),
    ...parseLargeArticles($),
    ...parseColumnOfShame($),
  ];

  console.log('Steo');

  // $('a')
  //   .filter(testFilter)
  //   .each((i, el) => {
  //     const texts = getTexts(el);
  //     const longestText =
  //       texts.length > 0
  //         ? texts.reduce((a, b) => (a.length > b.length ? a : b))
  //         : '';
  //     const images = getImages(el);
  //
  //     results.push({
  //       text: longestText,
  //       href: el.attribs.href,
  //       img: images.length > 0 ? images[0] : null,
  //     });
  //   });

  console.log(results);
};

module.exports = track;
