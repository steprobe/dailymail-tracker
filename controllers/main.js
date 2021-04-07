const cache = require('memory-cache');

const Article = require('../models/Article');
const Keyword = require('../models/Keyword');

const generateRankings = async () => {
  const keywords = await Keyword.find({});
  const rankings = await Promise.all(
    keywords.map(async (it) => ({
      keyword: it,
      articles: await Article.find({
        'matched._id': it._id,
      }),
    })),
  );

  const sortedRankings = rankings.sort(
    (one, other) => other.articles.length - one.articles.length,
  );

  return sortedRankings;
};

exports.getRankings = async () => {
  let rankings = cache.get('rankings');
  if (!rankings) {
    rankings = await generateRankings();
    cache.put('rankings', rankings);
  }

  return rankings;
};
