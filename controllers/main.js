const cache = require('memory-cache');
const Sentry = require('@sentry/node');
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

  return rankings.sort(
    (one, other) => other.articles.length - one.articles.length,
  );
};

exports.getRankings = async () => {
  let rankings = cache.get('rankings');
  if (!rankings) {
    console.log('rank cache miss');
    Sentry.addBreadcrumb({
      message: `getRankings cache miss`,
    });

    rankings = await generateRankings();
    cache.put('rankings', rankings);
  }

  return rankings;
};

exports.getKeywords = async () => {
  let keywords = cache.get('keywords');
  if (!keywords) {
    Sentry.addBreadcrumb({
      message: `getKeywords cache miss`,
    });

    keywords = await Keyword.find({});
    cache.put('keywords', keywords);
  }

  return keywords;
};

exports.getMetadata = async () => {
  let metadata = cache.get('metadata');
  if (!metadata) {
    Sentry.addBreadcrumb({
      message: `getMetadata cache miss`,
    });

    metadata = await Keyword.find({});
    cache.put('metadata', metadata);
  }

  return metadata;
};
