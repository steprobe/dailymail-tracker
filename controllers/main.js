const Article = require('../models/Article');
const Keyword = require('../models/Keyword');

exports.getRankings = async () => {
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

  return { rankings: sortedRankings };
};
