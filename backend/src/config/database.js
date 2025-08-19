const mongoose = require("mongoose");
const config = require("./config");

exports.connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      config.mongoose.url,
      config.mongoose.options
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.name}`);
  } catch (err) {
    console.error(`❌ Database connection error: ${err}`);
    process.exit(1);
  }
};
