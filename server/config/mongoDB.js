const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const res = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${res.connection.host}`)
  } catch(e) {
    console.log(e);
    process.exit(1);
  };
};

module.exports = connectDB