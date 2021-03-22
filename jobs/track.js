const cheerio = require('cheerio');
const got = require('got');

const track = async () => {
  const response = await got('https://www.dailymail.co.uk/home/index.html');
  const $ = cheerio.load(response.body);

  $('a').each((i, link) => {
    // const { href, title } = link.attribs;
    console.log(link);
  });
};

module.exports = track;
