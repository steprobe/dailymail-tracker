const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema(
  {
    headline: { type: String },
    articleText: { type: String },
    href: { type: String },
    image: { type: String },
    matched: [{ type: Object }],
  },
  { timestamps: true },
);

module.exports = mongoose.model('article', ArticleSchema);
