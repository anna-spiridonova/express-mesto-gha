const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '6454ed8154eb51b016253d4d',
  };
  next();
});

app.use(express.json());
app.use(router);

app.listen(PORT);
