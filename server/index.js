const express = require('express')
const cors = require('cors');
require('dotenv').config()

const connectDB = require('./config/mongoDB');
const { protect } = require('./config/authToken');

const port = process.env.PORT || 5000;

connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api', require('./routes/nonAuthRoutes'));
app.use('/api/auth', protect, require('./routes/authRoutes'));

app.use(require('./config/errorHandler'));

app.listen(port, () => {
  console.log(`Server listening at port ${port}.`);
});