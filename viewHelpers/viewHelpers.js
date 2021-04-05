exports.formatSyncDate = (state) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const date = state.metaData ? new Date(state.metaData.createdAt) : new Date();
  return `${months[date.getMonth()]} ${date.getDate()}`;
};

const hasRankings = (state) =>
  state.rankings != null && state.rankings.length > 0;

exports.hasRankings = hasRankings;

exports.getTodaysWord = (state) =>
  hasRankings(state) ? state.rankings[0].keyword.matches[0] : 'no word';

exports.getTodaysWordArticleCount = (state) =>
  hasRankings(state) ? state.rankings[0].articles.length : 0;

exports.getTodaysWordDescription = (state) =>
  hasRankings(state) ? state.rankings[0].keyword.description : 'no description';

exports.getDisplayArticles = (state) => {
  const articleCount = Math.min(3, state.rankings[0].articles.length);
  return state.rankings[0].articles.slice(0, articleCount);
};

exports.getTodaysWordRunnersUp = (state) => {
  const runnerUpCount = Math.min(3, state.rankings.length - 1);
  return state.rankings.slice(1, runnerUpCount + 1).map((it) => ({
    title: it.keyword.matches[0],
    articleCount: it.articles.length,
  }));
};
