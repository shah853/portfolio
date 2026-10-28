const dns = require('dns');
const mongoose = require('mongoose');

dns.setServers(['8.8.8.8', '1.1.1.1']);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async (retries = 5) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`DB connect failed (${attempt}/${retries}): ${error.message}`);
      if (attempt === retries) process.exit(1);
      await wait(3000);
    }
  }
};

module.exports = connectDB;