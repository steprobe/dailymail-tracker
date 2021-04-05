exports.formatSyncDate = (dateStr) => {
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

  const date = new Date(dateStr);

  return `${months[date.getMonth()]} ${date.getDate()}`;
};

exports.getTodaysWord = (state) => state.rankings[1].keyword.matches[0];
exports.getTodaysWordArticleCount = (state) =>
  state.rankings[1].articles.length;

exports.getTodaysWordDescription = (state) =>
  state.rankings[1].keyword.description;
