const cheerio = require('cheerio');
const got = require('got');

const matches = (i, link) => {
  return link.attribs.href !== undefined && link.attribs.href.includes('ample');
};

const track = async () => {
  const response = await got('https://www.dailymail.co.uk/home/index.html');
  const $ = cheerio.load(response.body);

  $('a')
    .filter(matches)
    .each((i, link) => {
      const { href, title } = link.attribs;
      console.log(link);
    });
};

module.exports = track;
