const mongoose = require('mongoose');
const db = require('config').get('mongoURI');

const connectDB = async () => {
  await mongoose.connect(
    db,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  );

  console.log('MongooseDB Connected');
};

module.exports = connectDB;