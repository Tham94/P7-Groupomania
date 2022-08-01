const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'server is running' });
});

app.use('/api/auth/', userRoutes);
app.use('/api/posts/', postRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
