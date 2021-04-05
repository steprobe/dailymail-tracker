const mongoose = require('mongoose');

const MetaDataSchema = new mongoose.Schema(
  {
    itemsSynced: { type: Number, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('metadata', MetaDataSchema);
