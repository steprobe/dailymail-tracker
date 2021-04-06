const mongoose = require('mongoose');

const KeywordSchema = new mongoose.Schema(
  {
    // An array to match different grammatical uses (sizzles, sizzling etc) which are effectively the same thing
    matches: [{ type: String, required: true }],
    description: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('keyword', KeywordSchema);
