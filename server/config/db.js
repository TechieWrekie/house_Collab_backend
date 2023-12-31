const mongoose = require('mongoose');
require('dotenv').config();

const dbPath = process.env.MONGO_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 30000, 
  socketTimeoutMS: 30000, 
};

 exports.connectToDatabase = async () => {
  try {
    await mongoose.connect(dbPath, options);
    console.log('Db Connected');
  } catch (err) {
    console.error('Db Connect Err', err);
  }
};


