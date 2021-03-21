const axios = require('axios');

const track = async () => {
  const res = await axios.get('https://www.dailymail.co.uk/home/index.html');
  return res;
};

module.exports = track;
