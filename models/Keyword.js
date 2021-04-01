const mongoose = require('mongoose');

const KeywordSchema = new mongoose.Schema(
  {
    keyword: { type: String, required: true },
    type: { type: String, enum: ['Wikipedia', 'Dictionary'], required: true },
    description: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('keyword', KeywordSchema);
