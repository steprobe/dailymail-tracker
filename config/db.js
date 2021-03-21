const mongoose = require('mongoose');

const connectToDb = async () => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  try {
    console.log(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log(`Successfully connected to Mongo @ ${process.env.MONGO_URI}`);
  } catch (err) {
    console.log(`${err.message} - Cant connect to ${process.env.MONGO_URI}`);
    process.exit(1);
  }
};

module.exports = connectToDb;
